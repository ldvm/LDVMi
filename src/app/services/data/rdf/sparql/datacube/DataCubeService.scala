package services.data.rdf.sparql.datacube

import data.models.{DataSourceRow, VisualizationRow}
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue

trait DataCubeService {

  def getDatasets(dataSource: DataSourceRow): Seq[DataCubeDataset]

  def getDataStructures(dataSource: DataSourceRow): Seq[DataCubeDataStructure]

  def getValues(dataSource: DataSourceRow, uris: List[String]): Map[String, Enumerator[Option[DataCubeComponentValue]]]

  def sliceCubeAndPersist(visualization: VisualizationRow, dataSource: DataSourceRow, queryData: DataCubeQueryData, queryDataJson: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult

}
