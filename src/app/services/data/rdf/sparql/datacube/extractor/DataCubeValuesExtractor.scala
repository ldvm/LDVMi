package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.query.{QueryExecution, QuerySolution}
import play.api.libs.iteratee.{Enumeratee, Enumerator}
import services.data.rdf.sparql.datacube.DataCubeComponentValue
import services.data.rdf.sparql.datacube.query.DataCubeValuesQuery
import services.data.rdf.sparql.extractor.QueryExecutionResultExtractor

import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext.Implicits.global


class DataCubeValuesExtractor extends QueryExecutionResultExtractor[DataCubeValuesQuery, Enumerator[Option[DataCubeComponentValue]]] {

  def extract(data: QueryExecution): Enumerator[Option[DataCubeComponentValue]] = {

    val enumerator = Enumerator.enumerate(data.execSelect().asInstanceOf[java.util.Iterator[QuerySolution]])
    enumerator.onDoneEnumerating(() => data.close())

    enumerator through Enumeratee.map { qs =>

      if (qs.contains(DataCubeValuesQuery.VALUE_PROPERTY_VARIABLE)) {
        val node = qs.get(DataCubeValuesQuery.VALUE_PROPERTY_VARIABLE)

        if (node.isResource) {
          val resource = node.asResource()
          val label = getLabel(qs)
          Some(new DataCubeComponentValue(label, Some(resource.getURI)))
        } else if (node.isLiteral) {
          val literal = node.asLiteral()
          Some(new DataCubeComponentValue(Some(literal.getString), None))
        } else {
          None
        }
      } else {
        None
      }
    }

  }

  private def getLabel(solution: QuerySolution): Option[String] = {
    if (solution.contains(DataCubeValuesQuery.VALUE_PREFLABEL_VARIABLE)) {
      Some(solution.get(DataCubeValuesQuery.VALUE_PREFLABEL_VARIABLE).asLiteral().getString)
    } else if (solution.contains(DataCubeValuesQuery.VALUE_NOTION_VARIABLE)) {
      Some(solution.get(DataCubeValuesQuery.VALUE_NOTION_VARIABLE).asLiteral().getString)
    } else if (solution.contains(DataCubeValuesQuery.VALUE_LABEL_VARIABLE)) {
      Some(solution.get(DataCubeValuesQuery.VALUE_LABEL_VARIABLE).asLiteral().getString)
    }

    None
  }

}
