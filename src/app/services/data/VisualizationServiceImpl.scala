package services.data

import data.models._
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class VisualizationServiceImpl extends VisualizationService {

  override val tableReference = TableQuery[VisualizationTable]
  val dataSources = TableQuery[DataSourcesTable]
  val visualizationQueries = TableQuery[VisualizationQueriesTable]

  def getByIdWithEager(id: Long)(implicit s: Session): Option[VisualizationEagerBox] = {
    (for {
      (((v, d), d2), vq) <- tableReference
        .filter(_.id === id)
        .take(1) innerJoin dataSources on (_.dataSourceId === _.id) leftJoin dataSources on (_._1.dsdDataSourceId === _.id) leftJoin visualizationQueries on (_._1._1.id === _.visualizationId)
    } yield (v, d, d2, vq.token.?)).firstOption.map((VisualizationEagerBox.apply _).tupled)
  }

  def listWithEager(skip: Int, take: Int)(implicit s: Session): Seq[VisualizationEagerBox] = {
    (for {
      (((v, d), d2), vq) <- tableReference
        .sortBy(v => (v.modifiedUtc.desc, v.createdUtc.desc, v.name))
        .drop(skip)
        .take(take) leftJoin dataSources on (_.dataSourceId === _.id) leftJoin dataSources on (_._1.dsdDataSourceId === _.id) leftJoin visualizationQueries on (_._1._1.id === _.visualizationId)
    } yield (v, d, d2, vq.token.?)).list.map((VisualizationEagerBox.apply _).tupled)
  }

}
