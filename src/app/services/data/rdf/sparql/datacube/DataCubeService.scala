package services.data.rdf.sparql.datacube

import data.models.{Visualization, DataSource}
import play.api.libs.json.JsValue

trait DataCubeService {

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset]

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure]

  def getValues(dataSource: DataSource, uris: List[String]): Map[String, Seq[DataCubeComponentValue]]

  def processCubeQuery(visualization: Visualization, dataSource: DataSource, queryData: DataCubeQueryData, queryDataJson: JsValue)(implicit rs: play.api.db.slick.Config.driver.simple.Session) : DataCubeQueryResult

  def queryCube(dataSource: DataSource, queryData: DataCubeQueryData) : String

}
