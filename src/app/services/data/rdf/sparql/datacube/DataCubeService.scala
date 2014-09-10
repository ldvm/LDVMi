package services.data.rdf.sparql.datacube

import data.models.{DataSource, Visualization}
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue

trait DataCubeService {

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset]

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure]

  def getValues(dataSource: DataSource, uris: List[String]): Map[String, Enumerator[Option[DataCubeComponentValue]]]

  def sliceCubeAndPersist(visualization: Visualization, dataSource: DataSource, queryData: DataCubeQueryData, queryDataJson: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult

}
