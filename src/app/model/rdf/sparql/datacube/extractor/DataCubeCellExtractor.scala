package model.rdf.sparql.datacube.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.datacube.query.DataCubeCellQuery
import model.rdf.sparql.datacube.{DataCubeCell, DataCubeKey}
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class DataCubeCellExtractor(k: DataCubeKey) extends QueryExecutionResultExtractor[DataCubeCellQuery, DataCubeCell] {

  def extract(input: QueryExecution): Option[DataCubeCell] = {

    val model = input.execConstruct()

    val values = k.measureUris.map { uri =>
      val measureProperty = model.getProperty(uri)
      val measureNodes = model.listObjectsOfProperty(measureProperty).toList
      uri -> measureNodes.collectFirst {
        case o if o.isLiteral => {
          val literal = o.asLiteral()
          BigDecimal.apply(Option(literal.getString).getOrElse("0"))
        }
      }
    }
    Some(new DataCubeCell(k, values.toMap))
  }
}
