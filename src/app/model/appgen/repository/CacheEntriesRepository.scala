package model.appgen.repository

import model.appgen.entity.{CacheEntries, CacheEntry, CacheEntryId}
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class CacheEntriesRepository extends BaseIdRepository[CacheEntryId, CacheEntry, CacheEntries](TableQuery[CacheEntries]) {
  def findByKey(key: String)(implicit session: Session): Option[CacheEntry] = {
    query.filter(_.key === key).firstOption
  }
}
