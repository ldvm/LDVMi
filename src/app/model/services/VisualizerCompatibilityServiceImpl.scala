package model.services

import model.dao._
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class VisualizerCompatibilityServiceImpl extends VisualizerCompatibilityService {

  override val tableReference = TableQuery[VisualizerCompatibilityTable]
  val visualizers = TableQuery[ComponentTable]

  def getByVisualizationId(id: Long)(implicit session: Session): Seq[ComponentCompatibilityEagerBox] = {
    (for {
      vc <- tableReference.sortBy(c => (c.modifiedUtc.desc, c.createdUtc.desc)) if vc.visualizationId === id
      v <- visualizers if vc.visualizerId === v.id
    } yield (vc, v)).list.map((ComponentCompatibilityEagerBox.apply _).tupled)
  }

  def getByIdWithEager(id: Long)(implicit s: Session): Option[ComponentCompatibilityEagerBox] = {
    (for {
      vc <- tableReference if vc.id === id
      v <- visualizers if vc.visualizerId === v.id
    } yield (vc, v)).firstOption.map((ComponentCompatibilityEagerBox.apply _).tupled)
  }

  def listWithEager(skip: Int, take: Int)(implicit s: Session): Seq[ComponentCompatibilityEagerBox] = {
    (for {
      vc <- tableReference.drop(skip).take(take)
      v <- visualizers if vc.visualizerId === v.id
    } yield (vc, v)).list.map((ComponentCompatibilityEagerBox.apply _).tupled)
  }
}