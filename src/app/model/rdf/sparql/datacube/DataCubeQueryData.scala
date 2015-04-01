package model.rdf.sparql.datacube

import model.rdf.sparql.ValueFilter

case class DataCubeQueryData(filters: DataCubeQueryFilter)

case class DataCubeQueryFilter(dsdUri: Option[String], componentFilters: Seq[DataCubeQueryComponentFilter])

case class DataCubeQueryComponentFilter(uri: String, componentType: String, valuesSettings: Seq[ValueFilter], isActive: Option[Boolean] = Some(false))
