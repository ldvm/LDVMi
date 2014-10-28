package model.services

import model.dao.{IdentifiedEntityTable, IdentifiedEntity}
import org.joda.time.{DateTime, DateTimeZone}
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

trait CRUDService[E <: IdentifiedEntity, ETable <: Table[E] with IdentifiedEntityTable[E], EBox <: EagerBox[E]] {

  val tableReference: TableQuery[ETable]

  def count(implicit s: Session): Long =
    tableReference.length.run

  def getById(id: Long)(implicit s: Session): Option[ETable#TableElementType] = {
    tableReference.filter(_.id === id).firstOption
  }

  def getByIdWithEager(id: Long)(implicit s: Session): Option[EBox]

  def list(implicit s: Session): Seq[ETable#TableElementType] = {
    (for (e <- tableReference) yield e).list
  }

  def list(skip: Int = 0, take: Int = 0)(implicit s: Session): Seq[ETable#TableElementType] = {
    (for {
      e <- tableReference.sortBy(_.id).drop(skip).take(take)
    } yield e).list
  }

  def listWithEager(skip: Int = 0, take: Int = 0)(implicit s: Session): Seq[EBox]

  def insert(row: E)(implicit s: Session) = {
    row.modifiedUtc = None
    row.createdUtc = Some(new DateTime).map(_.toDateTime(DateTimeZone.forOffsetHours(0)))
    tableReference.insert(row)
  }

  def insertAndGetId(row: ETable#TableElementType)(implicit s: Session) : Long = {
    row.modifiedUtc = None
    row.createdUtc = Some(new DateTime).map(_.toDateTime(DateTimeZone.forOffsetHours(0)))
    (tableReference returning tableReference.map(_.id)) += row
  }

  def deleteById(id: Long)(implicit s: Session): Boolean = {
    tableReference.filter(_.id === id).delete == 1
  }

  def updateById(id: Long, row: ETable#TableElementType)(implicit s: Session): Boolean = {
    row.modifiedUtc = Some(new DateTime).map(_.toDateTime(DateTimeZone.forOffsetHours(0)))
    row.createdUtc = getById(id).map(_.createdUtc).flatten

    tableReference.filter(_.id === id).update(row) == 1
  }

  def existsById(id: Long)(implicit s: Session): Boolean = {
    (for {
      row <- tableReference
      if row.id === id
    } yield row).firstOption.isDefined
  }

}
