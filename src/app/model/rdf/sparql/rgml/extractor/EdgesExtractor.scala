package model.rdf.sparql.rgml.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.Edge
import model.rdf.sparql.rgml.query.EdgesQuery
import model.rdf.vocabulary.RGML
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class EdgesExtractor extends QueryExecutionResultExtractor[EdgesQuery, Seq[Edge]] {

  def extract(input: QueryExecution): Option[Seq[Edge]] = {

    try {
      val model = input.execConstruct()
      val edgeStatements = model.listResourcesWithProperty(RGML.source).toList

      Some(edgeStatements.map { e =>
        val edgeResource = e.asResource()
        val source = edgeResource.getProperty(RGML.source).getResource.getURI
        val target = edgeResource.getProperty(RGML.target).getResource.getURI
        val weight = edgeResource.getProperty(RGML.weight).getDouble

        Edge(source, target, weight)
      })
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
