package services.data.rdf.sparql.datacube

import data.models.DataSource
import services.data.rdf.Node

trait DataCubeService {

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset]

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure]

  def getValues(dataSource: DataSource, uris: List[String]): Map[String, Seq[String]]

}
