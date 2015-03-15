package model.rdf.sparql.geo.extractor

import com.hp.hpl.jena.query.{QuerySolution, QueryExecution}
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.geo.query.GeoPropertiesQuery
import scala.collection.JavaConversions._

class GeoPropertiesExtractor extends QueryExecutionResultExtractor[GeoPropertiesQuery, Seq[(String, Option[String])]] {
  override def extract(input: QueryExecution): Option[Seq[(String, Option[String])]] = {
    val results = input.execSelect()

    val tupleIterator = results.map { querySolution =>
      (
        querySolution.getResource(GeoPropertiesQuery.NodeVariables.VALUE_PROPERTY_VARIABLE.toString).getURI,
        label(querySolution)
      )
    }

    Some(tupleIterator.toMap.toSeq)
  }

  def label(querySolution: QuerySolution) : Option[String] = {
    GeoPropertiesQuery.LabelVariables.values.collectFirst{
      case varName if querySolution.contains(varName.toString) => querySolution.getLiteral(varName.toString).getString
    }
  }
}
