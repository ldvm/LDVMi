package model.services.rdf.sparql.datacube

import model.dao.{VisualizationEagerBox, DataSource}
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue

trait DataCubeService {

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset]

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure]

  def getDataStructureComponents(dataSource: DataSource, uri: String): Seq[DataCubeComponent]

  def getValues(dataSource: DataSource, uris: List[String]): Map[String, Enumerator[Option[DataCubeComponentValue]]]

  def sliceCubeAndPersist(visualizationEagerBox: VisualizationEagerBox, queryData: DataCubeQueryData, queryDataJson: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult

}
