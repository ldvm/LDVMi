package model.component

import model.entity.{IdEntity, IdEntityTable}
import model.repository.CrudRepository
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import play.api.db.slick.Session

trait CrudComponent[
  Id <: BaseId,
  E <: IdEntity[Id],
  ETable <: Table[E] with IdEntityTable[Id, E],
  R <: CrudRepository[Id, E, ETable]
]{

  protected def repository: R

  def save(entity: E)(implicit session: Session) = repository.save(entity)

}
