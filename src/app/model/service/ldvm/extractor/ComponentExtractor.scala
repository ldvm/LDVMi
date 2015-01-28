package model.service.ldvm.extractor

import com.hp.hpl.jena.graph.TripleBoundary
import com.hp.hpl.jena.rdf.model.{Resource, StatementTripleBoundary, ModelExtract, Model, Property}
import com.hp.hpl.jena.vocabulary.{DCTerms, RDF, RDFS}
import model.rdf.Graph
import model.rdf.extractor.GraphExtractor
import model.rdf.vocabulary.LDVM
import scaldi.{Injector, Injectable}

import scala.collection.JavaConversions._

class ComponentExtractor(implicit inj: Injector) extends GraphExtractor[Map[String, Seq[model.dto.ComponentTemplate]]] with Injectable {

  val pipelineExtractor = inject[PipelineExtractor]

  override def extract(input: Graph): Option[Map[String, Seq[model.dto.ComponentTemplate]]] = {

    val graphModel = input.jenaModel

    val componentTemplateTypes = graphModel.listSubjectsWithProperty(RDFS.subClassOf, LDVM.componentTemplate).toList

    val componentStatementsByComponentTypes = componentTemplateTypes.map { componentTemplateTypes =>
      (componentTemplateTypes.getLocalName, graphModel.listSubjectsWithProperty(RDF.`type`, componentTemplateTypes).toList)
    }.toMap

    Some(componentStatementsByComponentTypes.map {
      case (componentType, componentStatements) =>

        val components = componentStatements.map { component =>
          val label = getLabel(component)
          val comment = getLiteralPropertyString(component, RDFS.comment)
          val inputs = extractInputs(graphModel, component)
          val output = extractOutputs(graphModel, component).headOption
          val features = extractFeatures(graphModel, component, inputs)
          val nestedMembers = extractNestedMembers(graphModel, component)

          val modelExtractor = new ModelExtract(new StatementTripleBoundary(TripleBoundary.stopNowhere))
          val configResource = component.getProperty(LDVM.componentConfigurationTemplate)

          val defaultConfigurationModel = configResource match {
            case null => None
            case _ => Some(modelExtractor.extract(configResource.getObject.asResource, graphModel))
          }

          model.dto.ComponentTemplate(component.getURI, label, comment, defaultConfigurationModel, inputs.values.toSeq, output, nestedMembers.toSeq, features)
        }

        (componentType, components)
    })
  }

  private def extractNestedMembers(graphModel: Model, component: Resource) = {
    val nestedMembers = graphModel.listObjectsOfProperty(LDVM.nestedMember).toList
    val componentInstances = nestedMembers.map { member =>
      val memberResource = member.asResource()
      pipelineExtractor.extractComponentInstance(memberResource, graphModel)
    }
    componentInstances
  }

  private def extractInputs(graphModel: Model, component: Resource): Map[String, model.dto.InputTemplate] = {
    val dataPorts = extractDataPort(graphModel, component, LDVM.inputTemplate)
    dataPorts.map(model.dto.InputTemplate).map {
      i => (i.dataPortTemplate.uri, i)
    }.toMap
  }

  private def extractDataPort(graphModel: Model, component: Resource, portType: Property): Seq[model.dto.DataPortTemplate] = {
    val templates = graphModel.listObjectsOfProperty(component, portType).toList
    templates.map {
      template =>
        val templateResource = template.asResource()
        val title = getLabel(templateResource)
        val description = getLiteralPropertyString(templateResource, DCTerms.description)

        model.dto.DataPortTemplate(templateResource.getURI, title, description)
    }.toSeq
  }

  private def extractFeatures(graphModel: Model, component: Resource, inputs: Map[String, model.dto.InputTemplate]): Seq[model.dto.Feature] = {
    val features = graphModel.listObjectsOfProperty(component, LDVM.feature).toList
    features.map { feature =>
      val featureResource = feature.asResource()
      val title = getLabel(featureResource)
      val description = getLiteralPropertyString(featureResource, DCTerms.title)
      val typeProperty = featureResource.getProperty(RDF.`type`)
      val typeResource = typeProperty.getObject.asResource()
      val isMandatory = typeResource.getURI == LDVM.mandatoryFeature.getURI

      val descriptors = extractDescriptors(graphModel, featureResource, inputs)

      model.dto.Feature(featureResource.getURI, title, description, isMandatory, descriptors)
    }
  }

  private def extractDescriptors(graphModel: Model, feature: Resource, inputs: Map[String, model.dto.InputTemplate]): Seq[model.dto.Descriptor] = {
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

  private def extractOutputs(graphModel: Model, component: Resource): Seq[model.dto.OutputTemplate] = {

    val dataPorts = extractDataPort(graphModel, component, LDVM.outputTemplate)
    dataPorts.map {
      dp =>
        val sample = graphModel.getProperty(graphModel.getResource(dp.uri), LDVM.outputDataSample)

        sample match {
          case null => model.dto.OutputTemplate(dp, None)
          case x => model.dto.OutputTemplate(dp, Some(x.getObject.asResource().getURI))
        }
    }
  }
}
