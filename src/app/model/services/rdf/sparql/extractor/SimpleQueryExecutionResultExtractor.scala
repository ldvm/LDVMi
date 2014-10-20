package model.services.rdf.sparql.extractor

import com.hp.hpl.jena.query.{QueryExecution, QuerySolution}
import com.hp.hpl.jena.rdf.model.{Literal, Resource}
import play.api.libs.iteratee.{Enumeratee, Enumerator}
import model.services.rdf.LocalizedValue
import model.services.rdf.sparql.query.SparqlQuery

import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext.Implicits.global

trait SimpleQueryExecutionResultExtractor[Q <: SparqlQuery, I] extends QueryExecutionResultExtractor[Q, Enumerator[Option[I]]] {

  def getPropertyVariableName: String

  def withResourceSolution(resource: Resource, qs: QuerySolution): Option[I]

  def withLiteralSolution(literal: Literal): Option[I]

  def extract(data: QueryExecution): Enumerator[Option[I]] = {

    val enumerator = Enumerator.enumerate(data.execSelect().asInstanceOf[java.util.Iterator[QuerySolution]])
    enumerator.onDoneEnumerating(() => data.close())

    enumerator through Enumeratee.map { qs =>

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
    }
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
    LocalizedValue(Seq(literal.getLanguage -> literal.getString).toMap)
  }
}
