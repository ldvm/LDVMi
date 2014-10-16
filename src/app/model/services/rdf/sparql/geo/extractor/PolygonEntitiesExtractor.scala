package model.services.rdf.sparql.geo.extractor

import com.hp.hpl.jena.query.QuerySolution
import com.hp.hpl.jena.rdf.model.{Literal, Resource}
import model.services.rdf.sparql.extractor.SimpleQueryExecutionResultExtractor
import model.services.rdf.sparql.geo.WKTEntity
import model.services.rdf.sparql.geo.query.PolygonEntitiesQuery

class PolygonEntitiesExtractor extends SimpleQueryExecutionResultExtractor[PolygonEntitiesQuery, WKTEntity] {

  override def getPropertyName: String = PolygonEntitiesQuery.NodeVariables.geolocatedEntity.toString

  override def withResourceSolution(resource: Resource, qs: QuerySolution): Option[WKTEntity] = {

    val literalVariable = PolygonEntitiesQuery.NodeVariables.wkt.toString

    if (qs.contains(literalVariable)) {
      val node = qs.getLiteral(literalVariable)
      val wktString = node.getString.replaceFirst("<[^>]+> (.*)", "$1")
      Some(WKTEntity(None, wktString))
    } else {
      None
    }
  }

  override def withLiteralSolution(literal: Literal): Option[WKTEntity] = None
}
