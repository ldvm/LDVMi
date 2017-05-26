package model.rdf.sparql.geo.extractor

import model.rdf.LocalizedValue
import model.rdf.extractor.SimpleQueryExecutionResultExtractor
import model.rdf.sparql.geo.query.WKTEntitiesQuery
import model.rdf.sparql.geo.models.{MapQueryData, WKTEntity}
import org.apache.jena.query.QuerySolution
import org.apache.jena.rdf.model.{Literal, RDFNode, Resource}

class WKTEntitiesExtractor(data: MapQueryData) extends SimpleQueryExecutionResultExtractor[WKTEntitiesQuery, WKTEntity] {

  private lazy val groupByProperty = data.filters.headOption.map(_._1)
  val titleVariableName = WKTEntitiesQuery.NodeVariables.title.toString
  val nameVariableName = WKTEntitiesQuery.NodeVariables.name.toString

  override def getPropertyVariableName: String = WKTEntitiesQuery.NodeVariables.geolocatedEntity.toString

  override def withResourceSolution(resource: Resource, qs: QuerySolution): Option[WKTEntity] = {

    val literalVariable = WKTEntitiesQuery.NodeVariables.wkt.toString

    if (qs.contains(literalVariable)) {
      val node = qs.getLiteral(literalVariable)
      val wktString = node.getString.replaceFirst("<[^>]+> (.*)", "$1")

      val label = if (qs.contains(titleVariableName)) {
        val literal = qs.get(titleVariableName).asLiteral()
        Some(LocalizedValue(Seq(literal.getLanguage -> literal.toString).toMap))
      } else if (qs.contains(nameVariableName)) {
        val literal = qs.get(nameVariableName).asLiteral()
        Some(LocalizedValue(Seq(literal.getLanguage -> literal.toString).toMap))
      } else {
        None
      }

      val groupPropertyValue = groupByProperty.map(_ => value(qs.get("?v1")))

      Some(WKTEntity(label, wktString, groupPropertyValue))
    } else {
      None
    }
  }

  override def withLiteralSolution(literal: Literal): Option[WKTEntity] = None

  private def value(node: RDFNode): String = {
    if (node.isLiteral) {
      node.asLiteral().getString
    } else {
      node.asResource().getURI
    }
  }
}
