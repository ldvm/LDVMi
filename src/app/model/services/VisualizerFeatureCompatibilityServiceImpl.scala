package model.services

import model.dao._
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class VisualizerFeatureCompatibilityServiceImpl extends VisualizerFeatureCompatibilityService {

  override val tableReference = TableQuery[FeatureCompatibilityTable]
  val features = TableQuery[FeatureTable]

  def getByFeatureId(id: Long)(implicit session: Session): Seq[FeatureCompatibilityEagerBox] = {
    (for {
      vc <- tableReference.sortBy(c => (c.modifiedUtc.desc, c.createdUtc.desc)) if vc.inputBindingId === id
      v <- features if vc.featureId === v.id
    } yield (vc, v)).list.map((FeatureCompatibilityEagerBox.apply _).tupled)
  }

  def getByIdWithEager(id: Long)(implicit s: Session): Option[FeatureCompatibilityEagerBox] = {
    (for {
      vc <- tableReference if vc.id === id
      v <- features if vc.featureId === v.id
    } yield (vc, v)).firstOption.map((FeatureCompatibilityEagerBox.apply _).tupled)
  }

  def listWithEager(skip: Int, take: Int)(implicit s: Session): Seq[FeatureCompatibilityEagerBox] = {
    (for {
      vc <- tableReference.drop(skip).take(take)
      v <- features if vc.featureId === v.id
    } yield (vc, v)).list.map((FeatureCompatibilityEagerBox.apply _).tupled)
  }
}