package services.data

import data.models.{IdentifiedEntity, IdentifiedEntityTable}
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

trait IdentityEagerCRUDService[E <: IdentifiedEntity, ETable <: Table[E] with IdentifiedEntityTable[E]] extends CRUDService[E, ETable, IdentityEagerBox[E]] {

  def getByIdWithEager(id: Long)(implicit s: Session): Option[IdentityEagerBox[E]] =
    getById(id).map(IdentityEagerBox.apply)

  def listWithEager(skip: Int = 0, take: Int = 0)(implicit s: Session): Seq[IdentityEagerBox[E]] =
    list(skip, take).map(IdentityEagerBox.apply)

}
