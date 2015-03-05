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
      val name = model.getProperty(n.asResource(), SKOS.prefLabel).getString
      HierarchyNode(name)
    }

    hierarchyNodes.headOption
  }
}