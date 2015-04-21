package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class DataPortBindingSetCompatibilityCheckRepository extends CrudRepository[DataPortBindingSetCompatibilityCheckId, DataPortBindingSetCompatibilityCheck, DataPortBindingSetCompatibilityCheckTable](TableQuery[DataPortBindingSetCompatibilityCheckTable]) {
  def lastChecksOf(id: DataPortBindingSetId, skip: Int, take: Int)(implicit session: Session) = {
    (for {
      q <- query if q.dataPortBindingSetId === id
    } yield q).sortBy(e => (e.modifiedUtc.desc, e.createdUtc.desc)).drop(skip).take(take).list
  }
}
