package model.service

import model.entity.{PipelineDiscoveryId, CustomUnicornPlay, IdEntity, IdEntityTable}
import model.repository.CrudRepository
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._
import play.api.db
import play.api.db.slick.Session
import scala.slick.lifted.Ordered

trait CrudService[
  Id <: BaseId,
  E <: IdEntity[Id],
  ETable <: Table[E] with IdEntityTable[Id, E],
  R <: CrudRepository[Id, E, ETable]
]{

  protected def repository: R

  def save(entity: E)(implicit session: Session) = repository.save(entity)

  def saveAll(entities: Seq[E])(implicit session: Session) = repository.saveAll(entities)

  def findById(id: Id)(implicit session: Session) = repository.findById(id)

  def countAll(implicit session: Session) = repository.count

  def findPaginated[T <% Ordered](skip: Int = 0, take: Int = 50)
    (ordering: ETable => T = { e: ETable => (e.modifiedUtc.desc, e.createdUtc.desc) })
    (implicit session: Session): Seq[E] = {
      repository.findPaginatedOrdered(skip, take)(ordering)
  }

}
