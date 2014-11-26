package model.rdf.sparql.datacube

import model.entity.{DataSourceEagerBox, DataSource}
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue

trait DataCubeService {

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset]

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure]

  def getDataStructureComponents(dataSource: DataSource, uri: String): Seq[DataCubeComponent]

  def getValues(dataSourceEagerBox: DataSourceEagerBox, uris: List[String]): Map[String, Option[Enumerator[Option[DataCubeComponentValue]]]]

  /*def sliceCubeAndPersist(visualizationEagerBox: VisualizationEagerBox, queryData: DataCubeQueryData, queryDataJson: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult*/

}
