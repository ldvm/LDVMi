package model.rdf.sparql.visualization.extractor

import java.io.StringWriter

import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.rdf.model.{Model, Resource}
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.HierarchyNode
import model.rdf.sparql.visualization.query.SchemeQuery
import model.rdf.vocabulary.SKOS
import scala.collection.JavaConversions._
import scala.collection.mutable

class SchemeExtractor(schemeUri: String) extends QueryExecutionResultExtractor[SchemeQuery, HierarchyNode] {

  private val conceptsByUri = new mutable.HashMap[String, HierarchyNode]
  private val hierarchyLinksByUri = new mutable.HashMap[String, Seq[String]]

  def extract(input: QueryExecution): Option[HierarchyNode] = {
    val model = input.execConstruct()
    val concepts = model.listSubjectsWithProperty(RDF.`type`, SKOS.Concept).toList
    val schemeResource = model.getResource(schemeUri)
    Some(buildHierarchy(schemeResource, concepts, model))
  }

  private def buildHierarchy(schemeResource: Resource, concepts: Seq[Resource], model: Model) : HierarchyNode = {
    val rootUris = concepts.flatMap { n =>
      val nodeResource = n.asResource()
      conceptsByUri.put(nodeResource.getURI, getNode(model, nodeResource))

      val broaderNodeResource = nodeResource.getPropertyResourceValue(SKOS.broader)
      val maybeBroader = Option(broaderNodeResource)

      maybeBroader.foreach { b =>
        hierarchyLinksByUri.put(b.getURI, hierarchyLinksByUri.getOrElse(b.getURI, Seq()) ++ Seq(nodeResource.getURI))
      }

      val hasBroader = maybeBroader.isDefined
      if(hasBroader) {
        None
      }else{
        Some(nodeResource.getURI) // URI of root
      }
    }

    val roots = rootUris.flatMap(buildSubtree)
    val schemeLabel = Option(schemeResource)
      .flatMap(r => Option(r.getProperty(SKOS.prefLabel)).map(_.getString))
      .getOrElse(schemeUri.split("[/#]").lastOption.getOrElse(schemeUri))
    HierarchyNode(schemeLabel, schemeUri, Some(1), Some(roots))
  }

  private def getNode(model: Model, nodeResource: Resource) : HierarchyNode = {
    val maybeNameNode = Option(model.getProperty(nodeResource, SKOS.prefLabel))
    val name = maybeNameNode.map{n => n.getString}.getOrElse(nodeResource.getURI)
    val value = model.getProperty(nodeResource, RDF.value)
    val intValue = Option(value).map(_.getInt)
    HierarchyNode(name, nodeResource.getURI, if(intValue.isDefined){ intValue } else { Some(1) })
  }

  private def buildSubtree(rootUri: String): Option[HierarchyNode] = {

    val maybeConceptNode = conceptsByUri.get(rootUri)
    maybeConceptNode.map { n =>

      val maybeChildrenList = hierarchyLinksByUri.get(rootUri)
      val maybeChildren = maybeChildrenList.map { childrenList =>
        childrenList.map(buildSubtree).collect { case Some(t) => t }
      }

      val size = if(maybeChildren.isEmpty) { Some(1) } else { None }
      HierarchyNode(n.name, n.uri, size, maybeChildren)
    }

  }
}
