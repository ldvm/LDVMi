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
          querySolution.getLiteral("lat").getFloat,
          querySolution.getLiteral("lng").getFloat
        )
      )
    }

    Some(markerIterator.toSeq)
  }
}
