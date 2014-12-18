package model.service.ldvm.extractor

import com.hp.hpl.jena.graph.TripleBoundary
import com.hp.hpl.jena.rdf.model.{Model, ModelExtract, Resource, StatementTripleBoundary}
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.Graph
import model.rdf.extractor.GraphExtractor
import model.rdf.vocabulary.LDVM

import scala.collection.JavaConversions._

class PipelineExtractor extends GraphExtractor[Seq[model.dto.Pipeline]] {

  override def extract(input: Graph): Option[Seq[model.dto.Pipeline]] = {

    val graphModel = input.jenaModel

    val pipelineStatements = graphModel.listStatements(null, RDF.`type`, LDVM.pipeline).toList
    Some(pipelineStatements.map { ps =>
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
    })
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
}
