package model.repository

import model.entity.{CustomUnicornPlay, UriIdentifiedEntityTable, UriIdentifiedEntity}
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class UriIdentifiedRepository[
Id <: BaseId,
E <: UriIdentifiedEntity[Id],
ETable <: Table[E] with UriIdentifiedEntityTable[Id, E]
](protected override val query: TableQuery[ETable])
  (implicit override val mapping: BaseColumnType[Id])
  extends CrudRepository[Id, E, ETable](query)(mapping) {

  def findByUri(uri: String)(implicit session: Session) : Option[E] = {
    query.filter(_.uri === uri).firstOption
  }

  override def save(entity: E)(implicit session: Session) = {
    //query.filter(_.uri === entity.uri).delete
    super.save(entity)
  }

}
