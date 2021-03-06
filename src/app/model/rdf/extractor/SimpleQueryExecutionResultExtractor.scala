package model.rdf.extractor

import org.apache.jena.query.{QueryExecution, QuerySolution}
import org.apache.jena.rdf.model.{Literal, Resource}
import play.api.libs.iteratee.{Enumeratee, Enumerator}
import model.rdf.LocalizedValue
import model.rdf.sparql.query.SparqlQuery

import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext.Implicits.global

trait SimpleQueryExecutionResultExtractor[Q <: SparqlQuery, I] extends QueryExecutionResultExtractor[Q, Enumerator[Option[I]]] {

  def getPropertyVariableName: String

  def withResourceSolution(resource: Resource, qs: QuerySolution): Option[I]

  def withLiteralSolution(literal: Literal): Option[I]

  def extract(data: QueryExecution): Option[Enumerator[Option[I]]] = {
    val enumerator = Enumerator.enumerate(data.execSelect().asInstanceOf[java.util.Iterator[QuerySolution]])
    enumerator.onDoneEnumerating(() => data.close())

    Some(enumerator through Enumeratee.map { qs =>

      val propertyVarName = getPropertyVariableName

      if (qs.contains(propertyVarName)) {
        val node = qs.get(propertyVarName)

        node match {
          case n if n.isResource => withResourceSolution(n.asResource(), qs)
          case n if n.isLiteral => withLiteralSolution(n.asLiteral())
          case _ => None
        }
      } else {
        None
      }
    })
  }

  protected def getLabel(solution: QuerySolution, labelVariables: Enumeration): Option[LocalizedValue] = {

    labelVariables.values.find { v =>
      solution.contains(v.toString)
    }.map { v =>
      val label = solution.get(v.toString)
      localizedLabel(label.asLiteral())
    }
  }

  protected def localizedLabel(literal: Literal): LocalizedValue = {
    var lang = literal.getLanguage
    if(lang == ""){
      lang = "nolang"
    }
    LocalizedValue(Seq(lang -> literal.getString).toMap)
  }
}
