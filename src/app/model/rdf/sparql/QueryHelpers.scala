package model.rdf.sparql

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

  def bindTimeDescriptionToXSDDate(inTimeUrlVariable:String, outXsdDateVariable: String) : String = {
    val out_str = outXsdDateVariable + "_str"

    val day   = outXsdDateVariable + "_day"
    val month = outXsdDateVariable + "_month"
    val year  = outXsdDateVariable + "_year"

    val day_str   = day   + "_str"
    val month_str = month + "_str"
    val year_str  = year  + "_str"

    return s"""
              | ?${inTimeUrlVariable} a time:DateTimeDescription;
              |   time:year  ?${year_str};
              |   time:month ?${month_str};
              |   time:day   ?${day_str}.
              |
              | BIND (substr(strdt(?${day_str},   xsd:string), 4, 2) AS ?${day})
              | BIND (substr(strdt(?${month_str}, xsd:string), 3, 2) AS ?${month})
              | BIND (substr(strdt(?${year_str},  xsd:string), 1, 4) AS ?${year})
              |
              | BIND (concat(?${year}, "-", ?${month}, "-", ?${day}) AS ?${out_str})
              | BIND (strdt(?${out_str}, xsd:date) AS ?${outXsdDateVariable})
    """.stripMargin
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
    new SimpleDateFormat("yyyy-MM-dd" ).format(date)
  }
}
