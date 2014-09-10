package services.data

import data.models._
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class VisualizationServiceImpl extends VisualizationService {

  override val tableReference = TableQuery[VisualizationTable]
  val dataSources = TableQuery[DataSourcesTable]

  def getByIdWithEager(id: Long)(implicit s: Session): Option[VisualizationEagerBox] = {
    (for {
      ((v, d), d2) <- tableReference
        .filter(_.id === id)
        .take(1) innerJoin dataSources on (_.dataSourceId === _.id) leftJoin dataSources on (_._1.dsdDataSourceId === _.id)
    } yield (v,d,d2)).firstOption.map((VisualizationEagerBox.apply _).tupled)
  }

  def listWithEager(skip: Int, take: Int)(implicit s: Session): Seq[VisualizationEagerBox] = {
    (for {
      ((v, d), d2) <- tableReference
        .sortBy(_.name)
        .drop(skip)
        .take(take) leftJoin dataSources on (_.dataSourceId === _.id) leftJoin dataSources on (_._1.dsdDataSourceId === _.id)
    } yield (v,d,d2)).list().map((VisualizationEagerBox.apply _).tupled)
  }

}
