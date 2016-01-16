package model.service.ldvm.extractor

import org.apache.jena.graph.TripleBoundary
import org.apache.jena.rdf.model.{StatementTripleBoundary, ModelExtract, Model, Resource}
import org.apache.jena.vocabulary.RDF
import model.dto.ConcreteComponentInstance
import model.rdf.Graph
import model.rdf.extractor.GraphExtractor
import model.rdf.vocabulary.LDVM

import scala.collection.JavaConversions._

class PipelineExtractor extends GraphExtractor[Seq[model.dto.BoundComponentInstances]] {

  override def extract(input: Graph): Option[Seq[model.dto.BoundComponentInstances]] = {

    val graphModel = input.jenaModel

    val pipelineStatements = graphModel.listStatements(null, RDF.`type`, LDVM.pipeline).toList // scalastyle:ignore
    Some(pipelineStatements.map { ps =>
      val pipelineResource = ps.getSubject.asResource()
      val title = getLabel(pipelineResource)

      val membersStatements = graphModel.listStatements(pipelineResource, LDVM.member, null).toList // scalastyle:ignore
    val componentInstances = membersStatements.map { memberStatement =>
        val componentInstanceResource = memberStatement.getObject.asResource
        extractComponentInstance(componentInstanceResource, graphModel)
      }

      model.dto.BoundComponentInstances(componentInstances, Some(pipelineResource.getURI), title)
    })
  }

  def extractComponentInstance(resource: Resource, graphModel: Model): ConcreteComponentInstance = {
    val templateUri = resource.getProperty(LDVM.instanceOf).getResource.getURI
    val memberType = resource.getProperty(RDF.`type`).getResource.getLocalName
    val title = getLabel(resource)

    val modelExtractor = new ModelExtract(new StatementTripleBoundary(TripleBoundary.stopNowhere))
    val configurationResource = resource.getProperty(LDVM.componentConfigurationInstance)

    val configurationModel = Option(configurationResource).map { cr =>
      modelExtractor.extract(cr.getObject.asResource, graphModel)
    }

    val inputInstances = extractInputInstances(graphModel, resource)
    val outputInstance = extractOutputInstance(graphModel, resource)
    val componentInstance = model.dto.ComponentInstance(resource.getURI, templateUri, title, inputInstances, outputInstance, configurationModel)

    memberType match {
      case "VisualizerInstance" => model.dto.VisualizerInstance(componentInstance)
      case "AnalyzerInstance" => model.dto.AnalyzerInstance(componentInstance)
      case "DataSourceInstance" => model.dto.DataSourceInstance(componentInstance)
      case "TransformerInstance" => model.dto.TransformerInstance(componentInstance)
    }
  }


  private def extractInputInstances(graphModel: Model, componentInstance: Resource): Seq[model.dto.InputInstance] = {
    val inputStatements = graphModel.listStatements(componentInstance, LDVM.inputInstance, null).toList // scalastyle:ignore
    inputStatements.map { inputStatement =>
      val inputInstanceResource = inputStatement.getObject.asResource()
      val uri = inputInstanceResource.getURI
      val label = getLabel(inputInstanceResource)
      val templateUri = inputInstanceResource.getProperty(LDVM.dataPortInstanceOf).getObject.asResource().getURI
      val boundTo = inputInstanceResource.listProperties(LDVM.boundTo).toList.map(_.getObject.asResource().getURI).toList
      val nestedBoundTo = inputInstanceResource.listProperties(LDVM.nestedBoundTo).toList.map(_.getObject.asResource().getURI).toList

      model.dto.InputInstance(uri, label, templateUri, boundTo, nestedBoundTo)
    }
  }

  private def extractOutputInstance(graphModel: Model, componentInstance: Resource): Option[model.dto.OutputInstance] = {
    val outputStatements = graphModel.listStatements(componentInstance, LDVM.outputInstance, null).toList // scalastyle:ignore
    outputStatements.map { outputStatement =>
      val outputInstanceResource = outputStatement.getObject.asResource()
      val uri = outputInstanceResource.getURI
      val label = getLabel(outputInstanceResource)
      val templateUri = outputInstanceResource.getProperty(LDVM.dataPortInstanceOf).getResource.getURI
      val nestedBoundTo = outputInstanceResource.listProperties(LDVM.nestedBoundTo).toList.map(_.getObject.asResource().getURI).toList

      model.dto.OutputInstance(uri, label, templateUri, nestedBoundTo)
    }.headOption
  }
}
