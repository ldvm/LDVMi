package model.services

import model.dao.{VisualizerCompatibilityEagerBox, VisualizerCompatibilityTable, VisualizerTable}
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class CompatibilityServiceImpl extends CompatibilityService {

  override val tableReference = TableQuery[VisualizerCompatibilityTable]
  val visualizers = TableQuery[VisualizerTable]

  def getByVisualizationId(id: Long)(implicit session: Session): Seq[VisualizerCompatibilityEagerBox] = {
    (for {
      vc <- tableReference.sortBy(c => (c.modifiedUtc.desc, c.createdUtc.desc)) if vc.visualizationId === id
      v <- visualizers if vc.visualizerId === v.id
    } yield (vc, v)).list.map((VisualizerCompatibilityEagerBox.apply _).tupled)
  }

  def getByIdWithEager(id: Long)(implicit s: Session): Option[VisualizerCompatibilityEagerBox] = {
    (for {
      vc <- tableReference if vc.id === id
      v <- visualizers if vc.visualizerId === v.id
    } yield (vc, v)).firstOption.map((VisualizerCompatibilityEagerBox.apply _).tupled)
  }

  def listWithEager(skip: Int, take: Int)(implicit s: Session): Seq[VisualizerCompatibilityEagerBox] = {
    (for {
      vc <- tableReference.drop(skip).take(take)
      v <- visualizers if vc.visualizerId === v.id
    } yield (vc, v)).list.map((VisualizerCompatibilityEagerBox.apply _).tupled)
  }
}