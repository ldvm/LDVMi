package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class DataSourceTemplateRepository extends CrudRepository[DataSourceTemplateId, DataSourceTemplate, DataSourceTemplateTable](TableQuery[DataSourceTemplateTable]) {

  def findPermanent(implicit session: Session) = {
    (for{
      t <- query
      c <- t.componentTemplate if c.isTemporary === false
    } yield t).list
  }

}
