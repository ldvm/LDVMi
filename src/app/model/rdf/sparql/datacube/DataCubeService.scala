package model.rdf.sparql.datacube

import model.entity.{DataSourceTemplateEagerBox, DataSourceTemplate}
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue

trait DataCubeService {

  def getDatasets(dataSource: DataSourceTemplate): Seq[DataCubeDataset]

  def getDataStructures(dataSource: DataSourceTemplate): Seq[DataCubeDataStructure]

  def getDataStructureComponents(dataSource: DataSourceTemplate, uri: String): Seq[DataCubeComponent]

  def getValues(dataSourceEagerBox: DataSourceTemplateEagerBox, uris: List[String]): Map[String, Option[Enumerator[Option[DataCubeComponentValue]]]]

  /*def sliceCubeAndPersist(visualizationEagerBox: VisualizationEagerBox, queryData: DataCubeQueryData, queryDataJson: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult*/

}
