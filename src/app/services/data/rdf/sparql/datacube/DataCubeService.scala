package services.data.rdf.sparql.datacube

import data.models.DataSource

trait DataCubeService {

  def getDatasets(dataSource: DataSource) : Seq[DataCubeDataset]

}
