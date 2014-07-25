package services.data.rdf.sparql.datacube

case class DataCubeQueryData(filters: DataCubeQueryFilter)

case class DataCubeQueryFilter(dsdUri: String, componentFilters: Seq[DataCubeQueryComponentFilter])

case class DataCubeQueryComponentFilter(uri: String, componentType: String, valuesSettings: Seq[DataCubeQueryValueFilter])

case class DataCubeQueryValueFilter(label: Option[String] = None, uri: Option[String] = None, isActive: Option[Boolean] = Some(false))
