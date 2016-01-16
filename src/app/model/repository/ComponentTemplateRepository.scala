package model.repository

import model.entity._
import model.entity.{ComponentTemplate, ComponentTemplateId, ComponentTemplateTable}
import model.entity.CustomUnicornPlay.driver.simple._
import com.github.tototoshi.slick.JdbcJodaSupport._

class ComponentTemplateRepository extends UriIdentifiedRepository[ComponentTemplateId, ComponentTemplate, ComponentTemplateTable](TableQuery[ComponentTemplateTable]) {
  def deleteExpired(hoursCount: Int)(implicit session: Session) = {
    val templatesToDelete = query.filter(ct => !componentInstancesQuery.filter(ci => ci.componentTemplateId === ct.id).exists)
    val dataSourcesToDelete = dataSourceTemplatesQuery
      .filter(d => templatesToDelete.filter(t => d.componentTemplateId === t.id).exists)
      .filter(d => d.createdUtc < new org.joda.time.DateTime().minusHours(hoursCount))
    // delete only dataSources
    templatesToDelete.filter(t => dataSourcesToDelete.filter(d => d.componentTemplateId === t.id).exists).delete
  }
}
