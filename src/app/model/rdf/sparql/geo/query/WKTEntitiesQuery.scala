package model.rdf.sparql.geo.query

import model.rdf.sparql.geo.models.MapQueryData
import model.rdf.sparql.query.SparqlQuery
import model.rdf.sparql.{ValueFilter, VariableGenerator}
import model.rdf.vocabulary.{SCHEMA, SKOS}


class WKTEntitiesQuery(queryData: MapQueryData) extends SparqlQuery {

  lazy val variableGenerator = new VariableGenerator

  def get: String = {

    val restrictions = getRestrictions(queryData.filters)
    val valueVariable = if (queryData.filters.nonEmpty) { "?v1" } else { "" }

    prefixes +
      s"""
        | SELECT ?s ?l ?n ?p $valueVariable WHERE {
        |   ?s <http://www.opengis.net/ont/geosparql#hasGeometry> ?g .
        |      OPTIONAL { ?s rdfs:label ?l }
        |      OPTIONAL { ?s schema:name ?n }
        |   ?g <http://www.opengis.net/ont/geosparql#asWKT> ?p .
        |
        |   $restrictions
        | }
      """.stripMargin
  }

  private def prefixes = {

    val skosPrefix = SKOS.PREFIX_URL
    val schemaPrefix = SCHEMA.PREFIX_URL
    val rdfsPrefix = "http://www.w3.org/2000/01/rdf-schema#"

    s"""
      | PREFIX skos: <$skosPrefix>
      | PREFIX rdfs: <$rdfsPrefix>
      | PREFIX schema: <$schemaPrefix>
      |

    """
      .stripMargin
  }

  private def getRestrictions(rule: Map[String, Seq[ValueFilter]]): String = {


    rule.map { case (uri, valueFilters) =>

      val v = variableGenerator.next.getVariable
      val filters = restrictionFilters(variableGenerator.getVariable, valueFilters)

      s"""
        |  ?s <$uri> $v
        |  $filters
      """.stripMargin
    }.mkString("\n")
  }

  private def restrictionFilters(variable: String, filters: Seq[ValueFilter]): String = {
    filters.filterNot(_.isActive.getOrElse(false)).map { f =>
      labelOrUri(f).map { string =>
        s"""
          |  FILTER($variable != $string)
        """
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

object WKTEntitiesQuery {

  object NodeVariables extends Enumeration {
    type NodeVariables = Value
    val geolocatedEntity = Value("s")
    val wkt = Value("p")
    val title = Value("l")
    val name = Value("n")
  }

}
