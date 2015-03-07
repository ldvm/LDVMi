package model.rdf.sparql.visualization.extractor

import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.HierarchyNode
import model.rdf.sparql.visualization.query.HierarchyQuery
import model.rdf.vocabulary.SKOS
import scala.collection.JavaConversions._

class HierarchyExtractor extends QueryExecutionResultExtractor[HierarchyQuery, HierarchyNode] {

  def extract(input: QueryExecution): Option[HierarchyNode] = {

    val model = input.execConstruct()

    val nodes = model.listSubjectsWithProperty(RDF.`type`, SKOS.Concept).toList
    val hierarchyNodes = nodes.map { n =>

      val nodeResource = n.asResource()

      val name = model.getProperty(nodeResource, SKOS.prefLabel).getString
      val value = model.getProperty(nodeResource, RDF.value)
      val intValue = Option(value).map(_.getInt)
      val broader = nodeResource.getPropertyResourceValue(SKOS.broader)
      (nodeResource.getURI, (HierarchyNode(name, if(intValue.isDefined){intValue}else{Some(1)}), Option(broader).map(_.getURI)))
    }.toMap

    val tree = hierarchyNodes.map { case (uri, (node, broaderUri)) =>
      val childNodes = hierarchyNodes.collect { case (_, (n, b)) if b.contains(uri) => n }.toSeq
      (node.copy(children = if(childNodes.isEmpty) {None}else{Some(childNodes)}), broaderUri.isEmpty)
    }

    tree.find(n => n._2).map(_._1)
  }
}