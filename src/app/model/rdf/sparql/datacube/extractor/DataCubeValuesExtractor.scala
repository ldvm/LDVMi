package model.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.query.QuerySolution
import com.hp.hpl.jena.rdf.model.{Literal, Resource}
import model.rdf.sparql.datacube.DataCubeComponentValue
import model.rdf.sparql.datacube.query.DataCubeValuesQuery
import model.rdf.extractor.SimpleQueryExecutionResultExtractor


class DataCubeValuesExtractor extends SimpleQueryExecutionResultExtractor[DataCubeValuesQuery, DataCubeComponentValue] {

  override def getPropertyVariableName: String = DataCubeValuesQuery.NodeVariables.VALUE_PROPERTY_VARIABLE.toString

  override def withResourceSolution(resource: Resource, qs: QuerySolution): Option[DataCubeComponentValue] = {
    val label = getLabel(qs, DataCubeValuesQuery.LabelVariables)
    Some(new DataCubeComponentValue(label, Some(resource.getURI)))
  }

  override def withLiteralSolution(literal: Literal): Option[DataCubeComponentValue] = {
    Some(new DataCubeComponentValue(Some(localizedLabel(literal)), None, Some(literal.getDatatypeURI)))
  }
}
