package model.appgen.entity

import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import scala.slick.lifted.Tag

case class CacheEntryId(id: Long) extends AnyVal with BaseId

object CacheEntryId extends IdCompanion[CacheEntryId]

case class CacheEntry(id: Option[CacheEntryId], key: String, value: String)
  extends WithId[CacheEntryId]


class CacheEntries(tag: Tag) extends IdTable[CacheEntryId, CacheEntry](tag, "appgen_cache_entries") {
  override val idColumnName = "id"
  def key = column[String]("key", O.NotNull)
  def value = column[String]("value", O.NotNull)

  def idx = index("idx_unique_key", key, unique = true)

  override def * = (id.?, key, value) <> (CacheEntry.tupled, CacheEntry.unapply)
}
