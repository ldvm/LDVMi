package model.repository

import model.entity._
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._
import play.api.db.slick.Session

trait EagerCrudRepository[
Id <: BaseId,
E <: IdEntity[Id],
ETable <: Table[E] with IdEntityTable[Id, E],
EBox <: EagerBox[E]
]
  extends CrudRepository[Id, E, ETable] {

  def findByIdWithEager(id: Id)(implicit s: Session): Option[EBox]

  def findPaginatedEager(skip: Int = 0, take: Int = 0)(implicit s: Session): Seq[EBox]

}
