package model.services

import model.dao.{VisualizationEagerBox, VisualizationTable, VisualizationQueriesTable, DataSourcesTable}
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

    val visualizationsWithSources = (for {
      v <- tableReference
      d <- dataSources if v.dataSourceId === d.id
      d2 <- dataSources if v.dsdDataSourceId === d2.id
    } yield (v, d, d2)).sortBy{ case (v,_,_) =>
      (v.modifiedUtc.desc, v.createdUtc.desc)
    }.drop(skip).take(take)

    val recentQueries = (for {
      vq <- visualizationQueries
    } yield vq)
      .groupBy(_.visualizationId)
      .map {
        case (visualizationId, group) => (
            visualizationId,
            group.map(_.id).max
          )
      }

    val withQueryIds = for {
      vb <- visualizationsWithSources leftJoin recentQueries on (_._1.id === _._1)
    } yield (vb._1, vb._2._2)

    val withTokens = for {
      r <- withQueryIds leftJoin visualizationQueries on (_._2 === _.id)
    } yield (r._1._1._1, r._1._1._2, r._1._1._3, r._2.token.?)

    withTokens.list.map((VisualizationEagerBox.apply _).tupled)
  }

}
