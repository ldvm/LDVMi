package model.services.rdf.sparql.geo.extractor

import com.hp.hpl.jena.query.QuerySolution
import com.hp.hpl.jena.rdf.model.{Literal, RDFNode, Resource}
import model.services.rdf.sparql.extractor.SimpleQueryExecutionResultExtractor
import model.services.rdf.sparql.geo.query.WKTEntitiesQuery
import model.services.rdf.sparql.geo.{WKTEntity, WKTQueryData}

class WKTEntitiesExtractor(data: WKTQueryData) extends SimpleQueryExecutionResultExtractor[WKTEntitiesQuery, WKTEntity] {

  private lazy val groupByProperty = data.filters.headOption.map(_._1)

  override def getPropertyName: String = WKTEntitiesQuery.NodeVariables.geolocatedEntity.toString

  override def withResourceSolution(resource: Resource, qs: QuerySolution): Option[WKTEntity] = {

    val literalVariable = WKTEntitiesQuery.NodeVariables.wkt.toString

    if (qs.contains(literalVariable)) {
      val node = qs.getLiteral(literalVariable)
      val wktString = node.getString.replaceFirst("<[^>]+> (.*)", "$1")

      groupByProperty match {
        case Some(p) => Some(WKTEntity(None, wktString, Some(value(groupByProperty, qs.get("?v1")))))
        case None => Some(WKTEntity(None, wktString, None))
      }
    } else {
      None
    }
  }

  override def withLiteralSolution(literal: Literal): Option[WKTEntity] = None

  private def value(groupByProperty: Option[String], node: RDFNode): String = {
    if (node.isLiteral) {
      node.asLiteral().getString
    } else {
      node.asResource().getURI
    }
  }
}
