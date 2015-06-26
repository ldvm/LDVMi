package model.rdf.sparql.visualization.extractor

import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.Concept
import model.rdf.sparql.visualization.query.{ConceptCountQuery, ConceptsBySchemaQuery}
import model.rdf.vocabulary.SKOS

import scala.collection.JavaConversions._

class ConceptCountExtractor extends QueryExecutionResultExtractor[ConceptCountQuery, Int] {

  def extract(input: QueryExecution): Option[Int] = {

    try {
      val resultset = input.execSelect()
      Some(resultset.nextSolution().getLiteral("count").getInt)
    } catch {
      case e: com.hp.hpl.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }

  }
}
