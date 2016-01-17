package model.rdf.sparql.visualization.extractor

import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.Scheme
import model.rdf.sparql.visualization.query.SchemesQuery
import model.rdf.vocabulary.SKOS
import org.apache.jena.query.QueryExecution
import org.apache.jena.vocabulary.RDF

import scala.collection.JavaConversions._

class SchemesExtractor extends QueryExecutionResultExtractor[SchemesQuery, Seq[Scheme]] {

  def extract(input: QueryExecution): Option[Seq[Scheme]] = {

    try {
      val model = input.execConstruct()
      val schemeStatements = model.listResourcesWithProperty(RDF.`type`, SKOS.ConceptScheme).toList

      Some(schemeStatements.map { s =>
        val schemeResource = s.asResource()

        val labelLiteral = schemeResource.getProperty(SKOS.prefLabel)

        val label = Option(labelLiteral).map(l => l.getObject.asLiteral().getString).getOrElse(schemeResource.getURI)

        Scheme(schemeResource.getURI, Some(LocalizedValue(Seq(("nolang", label)).toMap)), None)
      })
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }

  }
}
