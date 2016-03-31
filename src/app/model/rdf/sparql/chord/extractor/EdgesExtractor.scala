package model.rdf.sparql.chord.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.chord.Edge
import model.rdf.sparql.chord.query.EdgesQuery
import model.rdf.vocabulary.CHORD
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class EdgesExtractor extends QueryExecutionResultExtractor[EdgesQuery, Seq[Edge]] {

  def extract(input: QueryExecution): Option[Seq[Edge]] = {

    try {
      val model = input.execConstruct()
      val edgeStatements = model.listResourcesWithProperty(CHORD.source).toList

      Some(edgeStatements.map { e =>
        val edgeResource = e.asResource()
        val source = edgeResource.getProperty(CHORD.source).getResource.getURI
        val target = edgeResource.getProperty(CHORD.target).getResource.getURI

        Edge(source, target)
      })
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
