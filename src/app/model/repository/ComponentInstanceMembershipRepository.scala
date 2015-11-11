package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class ComponentInstanceMembershipRepository extends CrudRepository[ComponentInstanceMembershipId, ComponentInstanceMembership, ComponentInstanceMembershipTable](TableQuery[ComponentInstanceMembershipTable]){
  def cleanup(implicit session: Session) = {
    val membershipsToDelete = query.filter(m => !dataPortBindingSetsQuery.filter(bs => bs.id === m.bindingSetId).exists)
    dataSourceInstancesQuery.filter(instance => membershipsToDelete.filter(m => instance.componentInstanceId === m.componentInstanceId).exists).delete
    analyzerInstancesQuery.filter(instance => membershipsToDelete.filter(m => instance.componentInstanceId === m.componentInstanceId).exists).delete
    transformerInstancesQuery.filter(instance => membershipsToDelete.filter(m => instance.componentInstanceId === m.componentInstanceId).exists).delete
    visualizerInstancesQuery.filter(instance => membershipsToDelete.filter(m => instance.componentInstanceId === m.componentInstanceId).exists).delete
    membershipsToDelete.delete
  }
}
