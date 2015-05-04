package model.rdf.sparql.geo.extractor

import com.hp.hpl.jena.query.{QueryExecution, QuerySolution}
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.{Coordinates, MapQueryData, Marker}
import model.rdf.sparql.geo.query.{MarkerQuery, GeoPropertiesQuery}

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
        label(querySolution)
      )
    }

    Some(markerIterator.toSeq)
  }

  def label(querySolution: QuerySolution) : Option[String] = {
    GeoPropertiesQuery.LabelVariables.values.collectFirst{
      case varName if querySolution.contains(varName.toString) => querySolution.getLiteral(varName.toString).getString
    }
  }
}
