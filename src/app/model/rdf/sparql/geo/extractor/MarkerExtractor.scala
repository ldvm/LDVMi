package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.models.{Coordinates, MapQueryData, Marker}
import model.rdf.sparql.geo.query.MarkerQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}

import scala.collection.JavaConversions._
import scala.util.Try

class MarkerExtractor(queryData: MapQueryData) extends QueryExecutionResultExtractor[MarkerQuery, Seq[Marker]] {
  override def extract(input: QueryExecution): Option[Seq[Marker]] = {
    val results = input.execSelect()

    val markerIterator = results.map { querySolution =>
      Marker(
        querySolution.getResource("s").getURI,
        Coordinates(
          // The data might be corrupted and the coordinates might not always be valid numeric values.
          Try(querySolution.getLiteral("lat").getString.toFloat).getOrElse(Float.MaxValue),
          Try(querySolution.getLiteral("lng").getString.toFloat).getOrElse(Float.MaxValue)
        ),
        label(querySolution),
        description(querySolution)
      )
    } filter {
      // Skip markers with invalid coordinates.
      marker => marker.coordinates.lat != Float.MaxValue && marker.coordinates.lng != Float.MaxValue
    }

    Some(markerIterator.toSeq)
  }

  def label(querySolution: QuerySolution): Option[String] = {
    literal(querySolution, MarkerQuery.LabelVariables)
  }

  def description(querySolution: QuerySolution): Option[String] = {
    literal(querySolution, MarkerQuery.DescriptionVariables)
  }

  private def literal(querySolution: QuerySolution, variableNames: Enumeration): Option[String] = {
    variableNames.values.collectFirst {
      case varName if querySolution.contains(varName.toString) => querySolution.getLiteral(varName.toString).getString
    }
  }
}
