package controllers.api

import java.io.FileInputStream

import com.hp.hpl.jena.rdf.model.{Model, ModelFactory, Property, Resource}
import com.hp.hpl.jena.vocabulary.{DCTerms, RDF, RDFS}
import controllers.api.dto._
import model.component._
import model.entity.{Analyzer, DataSource, Transformer, Visualizer}
import model.rdf.vocabulary.LDVM
import play.api.Play
import play.api.Play.current
import play.api.db.slick.DBAction
import play.api.libs.json.{JsArray, JsNumber}
import play.api.mvc.Controller
import scaldi.{Injectable, Injector}

import scala.collection.JavaConversions._

class ComponentApiController(implicit inj: Injector) extends Controller with Injectable {

  val componentsComponent = inject[ComponentService]
  val analyzerComponent = inject[AnalyzerService]
  val visualizerComponent = inject[VisualizerService]
  val transformerComponent = inject[TransformerService]
  val dataSourceComponent = inject[DataSourceService]

  def ttl = DBAction(parse.multipartFormData) { rws =>
    rws.request.body.file("file").map { ttlFile =>

      val model = ModelFactory.createDefaultModel()

      model.read(new FileInputStream(Play.getFile("public/ttl/ldvm/vocabulary.ttl")), null, "N3")
      model.read(new FileInputStream(ttlFile.ref.file), null, "N3")

      val componentTemplateTypes = model.listSubjectsWithProperty(RDFS.subClassOf, LDVM.componentTemplate).toList
      val componentsByTypes = componentTemplateTypes.map { ctt =>
        (ctt.getLocalName, model.listSubjectsWithProperty(RDF.`type`, ctt).toList)
      }

      val componentIds = componentsByTypes.map { case (componentType, components) =>
        val ids = components.map { component =>
          val label = getLiteralPropertyString(component, RDFS.label)
          val comment = getLiteralPropertyString(component, RDFS.comment)
          val defaultConfiguration = extractConfiguration(model, component)
          val inputs = extractInputs(model, component)
          val output = extractOutputs(model, component).headOption
          val features = extractFeatures(model, component, inputs)

          Component(component.getURI, label, comment, defaultConfiguration, inputs.values.toSeq, output, features)
        }.map(c => componentsComponent.save(c)(rws.dbSession))

        componentType match {
          case "VisualizerTemplate" => ids.foreach(i => visualizerComponent.save(Visualizer(None, i))(rws.dbSession))
          case "AnalyzerTemplate" => ids.foreach(i => analyzerComponent.save(Analyzer(None, i))(rws.dbSession))
          case "DataSourceTemplate" => ids.foreach(i => dataSourceComponent.save(DataSource(None, i))(rws.dbSession))
          case "TransformerTemplate" => ids.foreach(i => transformerComponent.save(Transformer(None, i))(rws.dbSession))
        }

        ids
      }.flatten

      val pipelineStatements = model.listStatements(null, RDF.`type`, LDVM.pipeline).toList
      pipelineStatements.map { ps =>
        val pipelineResource = ps.getSubject.asResource()
        val title = getLiteralPropertyString(pipelineResource, DCTerms.title)

        Pipeline(pipelineResource.getURI, title)
      }


      Ok(JsArray(componentIds.map(i => JsNumber(i.id))))

    }.getOrElse {
      NotAcceptable
    }
  }

  private def extractInputs(model: Model, component: Resource): Map[String, Input] = {
    val dataPorts = extractDataPort(model, component, LDVM.inputTemplate)
    dataPorts.map(Input).map {
      i => (i.dataPort.uri, i)
    }.toMap
  }

  private def extractDataPort(model: Model, component: Resource, portType: Property): Seq[DataPort] = {
    val templates = model.listObjectsOfProperty(component, portType).toList
    templates.map {
      template =>
        val templateResource = template.asResource()
        val title = getLiteralPropertyString(templateResource, DCTerms.title)
        val description = getLiteralPropertyString(templateResource, DCTerms.description)

        DataPort(templateResource.getURI, title, description)
    }.toSeq
  }

  private def extractFeatures(model: Model, component: Resource, inputs: Map[String, Input]): Seq[Feature] = {
    val features = model.listObjectsOfProperty(component, LDVM.feature).toList
    features.map { feature =>
      val featureResource = feature.asResource()
      val title = getLiteralPropertyString(featureResource, DCTerms.title)
      val description = getLiteralPropertyString(featureResource, DCTerms.title)
      val isMandatory = featureResource.getProperty(RDF.`type`).getResource.getURI == LDVM.mandatoryFeature.getURI

      val signatures = extractSignatures(model, featureResource, inputs)

      Feature(featureResource.getURI, title, description, isMandatory, signatures)
    }
  }

  private def extractSignatures(model: Model, feature: Resource, inputs: Map[String, Input]): Seq[Signature] = {
    val signatures = model.listObjectsOfProperty(feature, LDVM.signature).toList
    signatures.map {
      signature =>
        val signatureResource = signature.asResource()
        val title = getLiteralPropertyString(signatureResource, DCTerms.title)
        val description = getLiteralPropertyString(signatureResource, DCTerms.description)
        val query = getLiteralPropertyString(signatureResource, LDVM.query)
        val inputUri = signatureResource.getPropertyResourceValue(LDVM.appliesTo).getURI

        query.map {
          ask =>
            Signature(signatureResource.getURI, title, description, ask, inputs(inputUri))
        }
    }.filter(_.isDefined).map(_.get).toSeq
  }

  private def getLiteralPropertyString(r: Resource, p: Property): Option[String] = {
    r.hasProperty(p) match {
      case true => Some(r.getProperty(p).getString)
      case _ => None
    }
  }

  private def extractConfiguration(model: Model, component: Resource): Option[String] = {
    None
  }

  private def extractOutputs(model: Model, component: Resource): Seq[Output] = {

    val dataPorts = extractDataPort(model, component, LDVM.outputTemplate)
    dataPorts.map {
      dp =>
        val sample = model.getProperty(model.getResource(dp.uri), LDVM.outputDataSample)

        sample match {
          case null => Output(dp, None)
          case x => Output(dp, Some(x.getString))
        }
    }
  }
}
