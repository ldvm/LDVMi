package model.rdf.sparql.rgml.query

import java.text.SimpleDateFormat
import java.util.Date

object QueryHelpers {
  def limitValues(fieldName: String,maybeUrlList: Option[Seq[String]]) : String = {
    maybeUrlList match {
      case Some(list) => {
        val urls = list.map(url => "<" + url + ">").mkString(" ")
        return s"VALUES ?$fieldName {$urls}"
      }
      case None => ""
    }
  }

  def limit(maybeLimit: Option[Int]) : String = {
    maybeLimit match {
      case Some(value) => s"LIMIT $value"
      case None => ""
    }
  }

  def select(variables: Seq[String]) : String = {
    val variableList = variables.map(v => "?" + v ).mkString(" ")
    return s"SELECT ${variableList}"
  }

  def group(variables: Seq[String]) : String = {
    val variableList = variables.map(v => "?" + v ).mkString(" ")
    return s"GROUP BY ${variableList}"
  }

  def count(variable: String) : String = {
    return s"SELECT COUNT(?${variable}) AS ?count"
  }

  def dateToString(date: Date): String = {
    new SimpleDateFormat("YYYY-MM-DD" ).format(date)
  }
}
