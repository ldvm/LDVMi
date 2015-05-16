package model.rdf.sparql.visualization.extractor

import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.Concept
import model.rdf.sparql.visualization.query.ConceptsQuery
import model.rdf.vocabulary.SKOS

import scala.collection.JavaConversions._

class ConceptsExtractor extends QueryExecutionResultExtractor[ConceptsQuery, Seq[Concept]] {

  def extract(input: QueryExecution): Option[Seq[Concept]] = {

    try {
      val model = input.execConstruct()
      val conceptStatements = model.listResourcesWithProperty(RDF.`type`, SKOS.Concept).toList

      Some(conceptStatements.map { c =>
        val conceptResource = c.asResource()
        val label = conceptResource.getProperty(SKOS.prefLabel).getObject.asLiteral().getString

        Concept(conceptResource.getURI, Some(LocalizedValue(Seq(("nolang", label)).toMap)), None)
      })
    } catch {
      case e: com.hp.hpl.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }

  }
}
