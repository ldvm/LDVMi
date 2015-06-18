package model.rdf.sparql.visualization.extractor

import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.rdf.model.{Model, Resource}
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.HierarchyNode
import model.rdf.sparql.visualization.query.SchemeQuery
import model.rdf.vocabulary.SKOS
import scala.collection.JavaConversions._
import scala.collection.mutable

class SchemeExtractor extends QueryExecutionResultExtractor[SchemeQuery, HierarchyNode] {

  private val conceptsByUri = new mutable.HashMap[String, HierarchyNode]
  private val hierarchyLinksByUri = new mutable.HashMap[String, Seq[String]]

  def extract(input: QueryExecution): Option[HierarchyNode] = {
    val model = input.execConstruct()
    val concepts = model.listSubjectsWithProperty(RDF.`type`, SKOS.Concept).toList
    Some(buildHierarchy(concepts, model))
  }

  private def buildHierarchy(concepts: Seq[Resource], model: Model) : HierarchyNode = {

    val roots = concepts.flatMap { n =>
      val nodeResource = n.asResource()
      conceptsByUri.put(nodeResource.getURI, getNode(model, nodeResource))
      val broaderNodeResource = nodeResource.getPropertyResourceValue(SKOS.broader)
      Option(broaderNodeResource).map{ b => hierarchyLinksByUri.put(b.getURI, hierarchyLinksByUri.getOrElse(b.getURI, Seq()) ++ Seq(nodeResource.getURI)) }
      Option(broaderNodeResource).flatMap(x => None).getOrElse(Some(nodeResource.getURI))
    }

    HierarchyNode("Scheme", Some(1), Some(roots.flatMap(u => tree(u, hierarchyLinksByUri, conceptsByUri))))
  }

  private def getNode(model: Model, nodeResource: Resource) : HierarchyNode = {
    val name = model.getProperty(nodeResource, SKOS.prefLabel).getString
    val value = model.getProperty(nodeResource, RDF.value)
    val intValue = Option(value).map(_.getInt)
    HierarchyNode(name, if(intValue.isDefined){intValue}else{Some(1)})
  }

  private def tree(rootUri: String, broaderMap: mutable.HashMap[String, Seq[String]], nodesMap: mutable.HashMap[String, HierarchyNode])
  : Option[HierarchyNode] = {

    nodesMap.get(rootUri).map { n =>

      val maybeChildrenList = broaderMap.get(rootUri)
      val children = maybeChildrenList.map { childrenList =>
        childrenList.map { child =>
          tree(child, broaderMap, nodesMap)
        }.collect { case Some(t) => t }
      }

      HierarchyNode(n.name, if(children.isEmpty) { Some(1) }else{ None }, children)
    }

  }
}
