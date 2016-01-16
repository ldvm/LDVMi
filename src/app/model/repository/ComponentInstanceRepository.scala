package model.repository

import model.entity._
import model.entity.CustomUnicornPlay.driver.simple._

class ComponentInstanceRepository extends UriIdentifiedRepository[ComponentInstanceId, ComponentInstance, ComponentInstanceTable](TableQuery[ComponentInstanceTable]) {
  def cleanup(implicit session: Session) = {
    query.filter(i => !componentInstanceMembershipQuery.filter(m => m.componentInstanceId === i.id).exists).delete
  }
}
