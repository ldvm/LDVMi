package model.rdf.sparql.geo.query

import java.util.regex.Matcher

import model.rdf.sparql.geo.models.MapQueryData
import model.rdf.sparql.query.SparqlQuery
import model.rdf.sparql.{ValueFilter, VariableGenerator}
import model.rdf.vocabulary.SKOS


class MarkerQuery(queryData: MapQueryData) extends SparqlQuery {

  val variableGenerator = new VariableGenerator

  def get: String = {

    variableGenerator.reset

    val effectiveFilter = queryData.filters.filter(_._2.exists(_.isActive.getOrElse(false) == false))

    val q = prefixes +
      """
        | SELECT ?s ?lat ?lng ?spl ?l ?sn ?st ?sd %v WHERE {
        |   ?s s:geo ?g .
        |   ?g s:latitude ?lat ;
        |      s:longitude ?lng .
        |
        |   OPTIONAL { ?s skos:prefLabel ?spl . }
        |   OPTIONAL { ?s rdfs:label ?l . }
        |   OPTIONAL { ?s skos:notation ?sn . }
        |   OPTIONAL { ?s s:name ?st . }
        |   OPTIONAL { ?s s:description ?sd . }
        |
        |   %r
        | }
      """
        .replaceAll(
          "%r", Matcher.quoteReplacement(getRestrictions(effectiveFilter)))
        .replaceAll("%v", if (effectiveFilter.nonEmpty) { "?v1" } else {"" })
        .stripMargin

    q
  }

  private def prefixes =
    """
      | PREFIX skos: <%skos>
      | PREFIX s: <http://schema.org/>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      |
    """
      .replaceAll("%skos", SKOS.PREFIX_URL)
      .stripMargin

  private def getRestrictions(rule: Map[String, Seq[ValueFilter]]): String = {
    rule.map { case (uri, valueFilters) =>

      val v = variableGenerator.next.getVariable
      val rf = Matcher.quoteReplacement(restrictionFilters(variableGenerator.getVariable, valueFilters))

      s"""
        |  ?s <$uri> $v .
        |  $rf
      """.stripMargin

    }.mkString("\n")
  }

  private def restrictionFilters(variable: String, filters: Seq[ValueFilter]): String = {
    filters.filterNot(_.isActive.getOrElse(false)).map { f =>
      labelOrUri(f).map { s =>

        val fv = Matcher.quoteReplacement(s)
        s"""
          |  FILTER($variable != $fv)
        """.stripMargin
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
  }

  object LabelVariables extends Enumeration {
    type LabelVariables = Value
    val schemaTitle = Value("st")
    val label = Value("l")
    val prefLabel = Value("spl")
    val notation = Value("sn")
  }

  object DescriptionVariables extends Enumeration {
    val description = Value("sd")
  }

}
