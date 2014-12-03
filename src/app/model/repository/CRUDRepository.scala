package model.repository

import model.entity.{IdEntityTable, IdEntity}
import org.joda.time.{DateTimeZone, DateTime}
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import play.api.db.slick.Session

class CrudRepository[
Id <: BaseId,
E <: IdEntity[Id],
ETable <: Table[E] with IdEntityTable[Id, E]
](protected override val query: TableQuery[ETable])
  (implicit override val mapping: BaseColumnType[Id])
  extends BaseIdRepository[Id, E, ETable](query)(mapping) {

  def count(implicit s: Session): Long = query.length.run

  def findPaginated(skip: Int = 0, pageSize: Int = 0)(implicit s: Session): Seq[ETable#TableElementType] = {
    (for {
      e <- query.sortBy(_.id).drop(skip).take(pageSize)
    } yield e).list
  }

  override def save(row: E)(implicit s: Session): Id = {
    val now = Some(new DateTime).map(_.toDateTime(DateTimeZone.forOffsetHours(0)))

    row.id match {
      case Some(id) => {
        row.modifiedUtc = now
        row.createdUtc = findExistingById(id).createdUtc
      }
      case None => {
        row.modifiedUtc = None
        row.createdUtc = now
      }
    }

    super.save(row)
  }
}