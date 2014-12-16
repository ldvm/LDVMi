package controllers.api

import java.io.FileInputStream

import com.hp.hpl.jena.graph.TripleBoundary
import com.hp.hpl.jena.rdf.model.{Model, ModelFactory, Resource, Property, ModelExtract, StatementTripleBoundary}
import com.hp.hpl.jena.vocabulary.{DCTerms, RDF, RDFS}
import model.service._
import model.entity._
import model.rdf.vocabulary.{SKOS, LDVM}
import play.api.Play
import play.api.Play.current
import play.api.db.slick.DBAction
import play.api.libs.json.{JsArray, JsNumber, JsObject}
import play.api.mvc.Controller
import scaldi.{Injectable, Injector}

import scala.collection.JavaConversions._

class ComponentApiController(implicit inj: Injector) extends Controller with Injectable {

  val componentsService = inject[ComponentService]
  val pipelineService = inject[PipelineService]
  val compatibilityService = inject[CompatibilityService]

  def check(pipelineId: Long) = DBAction { rws =>
    pipelineService.findById(PipelineId(pipelineId))(rws.dbSession).map { pipeline =>
      compatibilityService.check(pipeline.bindingSet(rws.dbSession))(rws.dbSession)

    }

    Ok("done")
  }

  def ttl = DBAction(parse.multipartFormData) { rws =>
    rws.request.body.file("file").map { ttlFile =>

      val graphModel = ModelFactory.createDefaultModel()

      graphModel.read(new FileInputStream(Play.getFile("public/ttl/ldvm/vocabulary.ttl")), null, "N3")
      graphModel.read(new FileInputStream(ttlFile.ref.file), null, "N3")

      val componentTemplateTypes = graphModel.listSubjectsWithProperty(RDFS.subClassOf, LDVM.componentTemplate).toList
      val componentsByTypes = componentTemplateTypes.map { ctt =>
        (ctt.getLocalName, graphModel.listSubjectsWithProperty(RDF.`type`, ctt).toList)
      }

      val componentIds = componentsByTypes.map { case (componentType, components) =>
        val ids = components.map { component =>
          val label = getLabel(component)
          val comment = getLiteralPropertyString(component, RDFS.comment)
          val inputs = extractInputs(graphModel, component)
          val output = extractOutputs(graphModel, component).headOption
          val features = extractFeatures(graphModel, component, inputs)

          val modelExtractor = new ModelExtract(new StatementTripleBoundary(TripleBoundary.stopNowhere))
          val configResource = component.getProperty(LDVM.componentConfigurationTemplate)

          val defaultConfigurationModel = configResource match {
            case null => None
            case _ => Some(modelExtractor.extract(configResource.getObject.asResource, graphModel))
          }

          model.dto.Component(component.getURI, label, comment, defaultConfigurationModel, inputs.values.toSeq, output, features)
        }.map(c => componentsService.save(c)(rws.dbSession))

        componentType match {
          case "VisualizerTemplate" => ids.foreach(i => componentsService.saveVisualizer(Visualizer(None, i))(rws.dbSession))
          case "AnalyzerTemplate" => ids.foreach(i => componentsService.saveAnalyzer(Analyzer(None, i))(rws.dbSession))
          case "DataSourceTemplate" => ids.foreach(i => componentsService.saveDataSource(DataSource(None, i))(rws.dbSession))
          case "TransformerTemplate" => ids.foreach(i => componentsService.saveTransformer(Transformer(None, i))(rws.dbSession))
        }

        ids
      }.flatten

      val pipelineStatements = graphModel.listStatements(null, RDF.`type`, LDVM.pipeline).toList
      val pipelines = pipelineStatements.map { ps =>
        val pipelineResource = ps.getSubject.asResource()
        val title = getLabel(pipelineResource)

        val membersStatements = graphModel.listStatements(pipelineResource, LDVM.member, null).toList
        val componentInstances = membersStatements.map { memberStatement =>
          val member = memberStatement.getObject.asResource
          val templateUri = member.getProperty(LDVM.instanceOf).getResource.getURI
          val memberType = member.getProperty(RDF.`type`).getResource.getLocalName
          val title = getLabel(member)

          val modelExtractor = new ModelExtract(new StatementTripleBoundary(TripleBoundary.stopNowhere))
          val configurationResource = member.getProperty(LDVM.componentConfigurationInstance)

          val configurationModel = configurationResource match {
            case null => None
            case _ => Some(modelExtractor.extract(configurationResource.getObject.asResource, graphModel))
          }

          val inputInstances = extractInputInstances(graphModel, member)
          val outputInstance = extractOutputInstance(graphModel, member)
          val componentInstance = model.dto.ComponentInstance(member.getURI, templateUri, title, inputInstances, outputInstance, configurationModel)

          memberType match {
            case "VisualizerInstance" => model.dto.VisualizerInstance(componentInstance)
            case "AnalyzerInstance" => model.dto.AnalyzerInstance(componentInstance)
            case "DataSourceInstance" => model.dto.DataSourceInstance(componentInstance)
            case "TransformerInstance" => model.dto.TransformerInstance(componentInstance)
          }
        }

        model.dto.Pipeline(pipelineResource.getURI, title, componentInstances)
      }

      val pipelineIds = pipelines.map(p => pipelineService.save(p)(rws.dbSession))

      Ok(
        JsObject(
          Seq(
            ("components", JsArray(componentIds.map(i => JsNumber(i.id)))),
            ("pipelines", JsArray(pipelineIds.map(i => JsNumber(i.id))))
          )
        )
      )

    }.getOrElse {
      NotAcceptable
    }
  }

  private def extractInputInstances(graphModel: Model, componentInstance: Resource): Seq[model.dto.InputInstance] = {
    val inputStatements = graphModel.listStatements(componentInstance, LDVM.inputInstance, null).toList
    inputStatements.map { inputStatement =>
      val inputInstanceResource = inputStatement.getObject.asResource()
      val uri = inputInstanceResource.getURI
      val label = getLabel(inputInstanceResource)
      val templateUri = inputInstanceResource.getProperty(LDVM.instanceOf).getObject.asResource().getURI
      val boundTo = inputInstanceResource.getProperty(LDVM.boundTo).getResource.getURI

      model.dto.InputInstance(uri, label, templateUri, boundTo)
    }
  }

  private def extractOutputInstance(graphModel: Model, componentInstance: Resource): Option[model.dto.OutputInstance] = {
    val outputStatements = graphModel.listStatements(componentInstance, LDVM.outputInstance, null).toList
    outputStatements.map { outputStatement =>
      val outputInstanceResource = outputStatement.getObject.asResource()
      val uri = outputInstanceResource.getURI
      val label = getLabel(outputInstanceResource)
      val templateUri = outputInstanceResource.getProperty(LDVM.instanceOf).getResource.getURI

      model.dto.OutputInstance(uri, label, templateUri)
    }.headOption
  }

  private def extractInputs(graphModel: Model, component: Resource): Map[String, model.dto.Input] = {
    val dataPorts = extractDataPort(graphModel, component, LDVM.inputTemplate)
    dataPorts.map(model.dto.Input).map {
      i => (i.dataPort.uri, i)
    }.toMap
  }

  private def extractDataPort(graphModel: Model, component: Resource, portType: Property): Seq[model.dto.DataPort] = {
    val templates = graphModel.listObjectsOfProperty(component, portType).toList
    templates.map {
      template =>
        val templateResource = template.asResource()
        val title = getLabel(templateResource)
        val description = getLiteralPropertyString(templateResource, DCTerms.description)

        model.dto.DataPort(templateResource.getURI, title, description)
    }.toSeq
  }

  private def extractFeatures(graphModel: Model, component: Resource, inputs: Map[String, model.dto.Input]): Seq[model.dto.Feature] = {
    val features = graphModel.listObjectsOfProperty(component, LDVM.feature).toList
    features.map { feature =>
      val featureResource = feature.asResource()
      val title = getLabel(featureResource)
      val description = getLiteralPropertyString(featureResource, DCTerms.title)
      val isMandatory = featureResource.getProperty(RDF.`type`).getResource.getURI == LDVM.mandatoryFeature.getURI

      val descriptors = extractDescriptors(graphModel, featureResource, inputs)

      model.dto.Feature(featureResource.getURI, title, description, isMandatory, descriptors)
    }
  }

  private def extractDescriptors(graphModel: Model, feature: Resource, inputs: Map[String, model.dto.Input]): Seq[model.dto.Descriptor] = {
    val signatures = graphModel.listObjectsOfProperty(feature, LDVM.descriptor).toList
    signatures.map {
      signature =>
        val signatureResource = signature.asResource()
        val title = getLabel(signatureResource)
        val description = getLiteralPropertyString(signatureResource, DCTerms.description)
        val query = getLiteralPropertyString(signatureResource, LDVM.query)
        val inputUri = signatureResource.getPropertyResourceValue(LDVM.appliesTo).getURI

        query.map {
          ask =>
            model.dto.Descriptor(signatureResource.getURI, title, description, ask, inputs(inputUri))
        }
    }.filter(_.isDefined).map(_.get).toSeq
  }

  private def getLiteralPropertyString(r: Resource, p: Property): Option[String] = {
    r.hasProperty(p) match {
      case true => Some(r.getProperty(p).getString)
      case _ => None
    }
  }

  private def getLabel(r: Resource): Option[String] = {
    val possibleLabels = Seq(DCTerms.title, RDFS.label, SKOS.prefLabel)
    possibleLabels.find(r.hasProperty).map(r.getProperty).map(_.getString)
  }

  private def extractOutputs(graphModel: Model, component: Resource): Seq[model.dto.Output] = {

    val dataPorts = extractDataPort(graphModel, component, LDVM.outputTemplate)
    dataPorts.map {
      dp =>
        val sample = graphModel.getProperty(graphModel.getResource(dp.uri), LDVM.outputDataSample)

        sample match {
          case null => model.dto.Output(dp, None)
          case x => model.dto.Output(dp, Some(x.getString))
        }
    }
  }
}
