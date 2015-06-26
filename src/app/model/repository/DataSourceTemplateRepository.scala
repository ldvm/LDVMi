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

  def findByComponentIds(ids: Seq[ComponentTemplateId])(implicit session: Session): Seq[SpecificComponentTemplate] = {
    (for {
      s <- query if s.componentTemplateId inSetBind ids
    } yield s).list
  }

  def findByUri(uri: String)(implicit session: Session): Option[DataSourceTemplate] = {
    (for {
      t <- query
      c <- t.componentTemplate if c.uri === uri
    } yield t).firstOption
  }
}
