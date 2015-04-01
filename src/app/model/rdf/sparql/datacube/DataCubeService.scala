package model.rdf.sparql.datacube

import model.entity.{PipelineEvaluation, DataSourceTemplateEagerBox, DataSourceTemplate}
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue

trait DataCubeService {

  def getDatasets(evaluation: PipelineEvaluation): Seq[DataCubeDataset]

  def getDataStructures(evaluation: PipelineEvaluation): Seq[DataCubeDataStructure]

  def getDataStructureComponents(evaluation: PipelineEvaluation, uri: String): Seq[DataCubeComponent]

  def getValues(evaluation: PipelineEvaluation, uris: List[String]): Map[String, Option[Enumerator[Option[DataCubeComponentValue]]]]

  def sliceCubeAndPersist(evaluation: PipelineEvaluation, queryData: DataCubeQueryData, queryDataJson: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult

}
