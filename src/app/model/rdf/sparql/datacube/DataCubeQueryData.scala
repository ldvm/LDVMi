package model.rdf.sparql.datacube

import model.rdf.sparql.ValueFilter

case class DataCubeQueryData(filters: DataCubeQueryFilter)

case class DataCubeQueryFilter(dsdUri: Option[String], components: Seq[DataCubeQueryComponentFilter])

case class DataCubeQueryComponentFilter(componentUri: String, `type`: String, values: Seq[ValueFilter], isActive: Option[Boolean] = Some(false))
