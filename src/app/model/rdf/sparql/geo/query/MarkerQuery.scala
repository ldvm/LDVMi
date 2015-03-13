package model.rdf.sparql.geo.query

import java.util.regex.Matcher

import model.rdf.sparql.geo.MapQueryData
import model.rdf.sparql.query.SparqlQuery
import model.rdf.sparql.{ValueFilter, VariableGenerator}
import model.rdf.vocabulary.SKOS


class MarkerQuery(queryData: MapQueryData) extends SparqlQuery {

  lazy val variableGenerator = new VariableGenerator

  def get: String = {
    val q = prefixes +
      """
        | SELECT ?s ?lat ?lng %v WHERE {
        |   ?s s:geo ?g .
        |   ?g s:latitude ?lat ;
        |      s:longitude ?lng .
        |
        |   %r
        | }
      """
        .replaceAll(
          "%r", Matcher.quoteReplacement(getRestrictions(queryData.filters)))
        .replaceAll("%v", if (queryData.filters.nonEmpty) { "?v1" } else {"" })
        .stripMargin

    println(q)

    q
  }

  private def prefixes =
    """
      | PREFIX skos: <%skos>
      | PREFIX s: <http://schema.org/>
      |

    """
      .replaceAll("%skos", SKOS.PREFIX_URL)
      .stripMargin

  private def getRestrictions(rule: Map[String, Seq[ValueFilter]]): String = {
    rule.map { case (uri, valueFilters) =>
      """
        |  ?g <%s> %v
        |  %rf
      """
        .replaceAll("%s", uri)
        .replaceAll("%v", variableGenerator.next.getVariable)
        .replaceAll("%rf", Matcher.quoteReplacement(restrictionFilters(variableGenerator.getVariable, valueFilters)))
        .stripMargin
    }.mkString("\n")
  }

  private def restrictionFilters(variable: String, filters: Seq[ValueFilter]): String = {
    filters.filterNot(_.isActive.getOrElse(false)).map { f =>
      labelOrUri(f).map { s =>
        """
          |  FILTER(%v != %fv)
        """
          .replaceAll("%v", variable)
          .replaceAll("%fv", Matcher.quoteReplacement(s))
          .stripMargin
      }
    }.filter(_.isDefined).map(_.get).mkString("\n")
  }

  private def labelOrUri(f: ValueFilter) = {
    f match {
      case u if f.uri.isDefined => u.uri.map("<" + _ + ">")
      case l if f.label.isDefined => l.label.map("'" + _ + "'")
      case _ => None
    }
  }

}

object MarkerQuery {

  object NodeVariables extends Enumeration {
    type NodeVariables = Value
    val geolocatedEntity = Value("s")
    val lat = Value("lat")
    val lng = Value("lng")
    val title = Value("l")
  }

}
