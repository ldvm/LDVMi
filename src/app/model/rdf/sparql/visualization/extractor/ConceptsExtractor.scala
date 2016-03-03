package model.rdf.sparql.visualization.extractor

import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.Concept
import model.rdf.sparql.visualization.query.ConceptsQuery
import model.rdf.vocabulary.SKOS
import org.apache.jena.query.QueryExecution
import org.apache.jena.vocabulary.RDF

import scala.collection.JavaConversions._

class ConceptsExtractor extends QueryExecutionResultExtractor[ConceptsQuery, Seq[Concept]] {

  def extract(input: QueryExecution): Option[Seq[Concept]] = {

    try {
      val model = input.execConstruct()
      val conceptStatements = model.listResourcesWithProperty(RDF.`type`, SKOS.Concept).toList

      Some(conceptStatements.map { c =>
        val conceptResource = c.asResource()

        val maybeLabelResource = Option(conceptResource.getProperty(SKOS.prefLabel))
        val label = maybeLabelResource.map(_.getObject.asLiteral().getString).getOrElse(conceptResource.getURI)

        val maybeSchemeResource = Option(conceptResource.getProperty(SKOS.inScheme))
        val schemeUri = maybeSchemeResource.map(_.getObject.asResource().getURI)

        val linkUris = Seq(SKOS.broader, SKOS.broaderTransitive, SKOS.narrower, SKOS.narrowerTransitive).flatMap { l =>
          val maybeLinkResource = Option(conceptResource.getProperty(l))
          maybeLinkResource.map(l.getURI -> _.getObject.asResource().getURI)
        }.toMap

        Concept(conceptResource.getURI, Some(LocalizedValue(Seq(("nolang", label)).toMap)), None, schemeUri, linkUris)
      })
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }

  }
}
