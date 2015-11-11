package model.rdf.sparql.geo.extractor

import model.rdf.Property
import model.rdf.extractor.SimpleQueryExecutionResultExtractor
import model.rdf.sparql.geo.query.PolygonEntitiesPropertiesQuery
import org.apache.jena.query.QuerySolution
import org.apache.jena.rdf.model.{Literal, Resource}


class PolygonEntitiesPropertiesExtractor extends SimpleQueryExecutionResultExtractor[PolygonEntitiesPropertiesQuery, Property] {

  override def getPropertyVariableName: String = PolygonEntitiesPropertiesQuery.NodeVariables.VALUE_PROPERTY_VARIABLE.toString
  def getSchemeVariableName: String = PolygonEntitiesPropertiesQuery.NodeVariables.VALUE_SCHEME_VARIABLE.toString

  override def withResourceSolution(resource: Resource, qs: QuerySolution): Option[Property] = {
    val label = getLabel(qs, PolygonEntitiesPropertiesQuery.LabelVariables)
    val schemeUri = qs.getResource(getSchemeVariableName).getURI
    Some(new Property(label, Some(resource.getURI), Some(schemeUri)))
  }

  override def withLiteralSolution(literal: Literal): Option[Property] = {
    Some(new Property(Some(localizedLabel(literal)), None, None))
  }
}
