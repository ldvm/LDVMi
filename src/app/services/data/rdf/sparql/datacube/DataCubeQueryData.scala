package services.data.rdf.sparql.datacube

case class DataCubeQueryData(filters: DataCubeQueryFilter)

case class DataCubeQueryFilter(dsdUri: Option[String], componentFilters: Seq[DataCubeQueryComponentFilter])

case class DataCubeQueryComponentFilter(uri: String, componentType: String, valuesSettings: Seq[DataCubeQueryValueFilter], isActive: Option[Boolean] = Some(false))

case class DataCubeQueryValueFilter(label: Option[String] = None, dataType: Option[String], uri: Option[String] = None, isActive: Option[Boolean] = Some(false))
