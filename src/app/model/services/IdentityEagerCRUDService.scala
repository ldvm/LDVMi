package model.services

import model.dao.{IdEntityTable, IdEntity}
import play.api.db.slick.Config.driver.simple._

import org.virtuslab.unicorn.LongUnicornPlay._

trait IdentityEagerCRUDService[EId <: BaseId, E <: IdEntity[EId], ETable <: Table[E] with IdEntityTable[E, EId]] extends CRUDService[E, ETable, IdentityEagerBox[E]] {

  def getByIdWithEager(id: Long)(implicit s: Session): Option[IdentityEagerBox[E]] =
    getById(id).map(IdentityEagerBox.apply)

  def listWithEager(skip: Int = 0, take: Int = 0)(implicit s: Session): Seq[IdentityEagerBox[E]] =
    list(skip, take).map(IdentityEagerBox.apply)

}
