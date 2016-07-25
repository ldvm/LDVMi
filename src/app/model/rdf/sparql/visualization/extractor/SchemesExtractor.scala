package model.rdf.sparql.visualization.extractor

import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.Scheme
import model.rdf.sparql.visualization.query.SchemesQuery
import model.rdf.vocabulary.SKOS
import org.apache.jena.query.QueryExecution
import org.apache.jena.vocabulary.{RDF, RDFS}

import scala.collection.JavaConversions._

class SchemesExtractor extends QueryExecutionResultExtractor[SchemesQuery, Seq[Scheme]] {

  def extract(input: QueryExecution): Option[Seq[Scheme]] = {

    try {
      val model = input.execConstruct()
      val schemeStatements = model.listResourcesWithProperty(RDF.`type`, SKOS.ConceptScheme).toList

      Some(schemeStatements.map { s =>
        val schemeResource = s.asResource()

        val possibleLabels = Seq(SKOS.prefLabel, RDFS.label)
        val literals = possibleLabels.flatMap { labelProperty =>
          val properties = schemeResource.listProperties(labelProperty).toList
          properties.map(_.getObject.asLiteral())
        }

        val map = literals.reverse.map(l => (l.getLanguage, l.getString)).toMap
        val localizedLabel = map.isEmpty match {
          case false => LocalizedValue(map)
          case true => LocalizedValue(Map(("nolang", "No label")))
        }

        Scheme(schemeResource.getURI, Some(localizedLabel), None)
      })
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }

  }
}
