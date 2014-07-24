package services.data.rdf.sparql.datacube

import data.models.DataSource

trait DataCubeService {

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset]

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure]

  def getValues(dataSource: DataSource, uris: List[String]): Map[String, Seq[DataCubeComponentValue]]

  def queryCube(dataSource: DataSource) : String

}
