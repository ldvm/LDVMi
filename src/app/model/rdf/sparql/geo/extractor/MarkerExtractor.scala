package model.rdf.sparql.geo.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.query.MarkerQuery
import model.rdf.sparql.geo.{Coordinates, MapQueryData, Marker}
import org.apache.jena.query.{QuerySolution, QueryExecution}

import scala.collection.JavaConversions._

class MarkerExtractor(queryData: MapQueryData) extends QueryExecutionResultExtractor[MarkerQuery, Seq[Marker]] {
  override def extract(input: QueryExecution): Option[Seq[Marker]] = {
    val results = input.execSelect()

    val markerIterator = results.map { querySolution =>
      Marker(
        querySolution.getResource("s").getURI,
        Coordinates(
          querySolution.getLiteral("lat").getString.toFloat,
          querySolution.getLiteral("lng").getString.toFloat
        ),
        label(querySolution),
        description(querySolution)
      )
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
