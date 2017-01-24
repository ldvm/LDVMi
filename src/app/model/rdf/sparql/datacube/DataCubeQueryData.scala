package model.rdf.sparql.datacube

import model.rdf.sparql.ValueFilter

case class DataCubeQueryData(filters: DataCubeQueryFilter) {
  def modify(dimensionUri: String, valueUri: String) = {
    this.copy(
      this.filters.copy(components = this.filters.components.map {
        case same if same.componentUri != dimensionUri => same
        case modified => {
          modified.copy(values = modified.values.map { v =>
            v.copy(isActive = v.uri.map(_ == valueUri))
          })
        }
      })
    )
  }
}

case class DataCubeQueryFilter(components: Seq[DataCubeQueryComponentFilter], datasetUri: String)

case class DataCubeQueryComponentFilter(componentUri: String, `type`: String, values: Seq[ValueFilter], isActive: Option[Boolean] = Some(false), order: Option[Int] = None)
