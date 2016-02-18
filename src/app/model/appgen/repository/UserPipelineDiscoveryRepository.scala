package model.appgen.repository

import model.appgen.entity._
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class UserPipelineDiscoveryRepository extends BaseIdRepository[UserPipelineDiscoveryId, UserPipelineDiscovery, UserPipelineDiscoveries] (TableQuery[UserPipelineDiscoveries]) {
  def find(user: User)(implicit session: Session): Seq[UserPipelineDiscovery] = {
    query.filter(_.userId === user.id.get).run
  }

  def findById(user: User, id: UserPipelineDiscoveryId)(implicit session: Session): Option[UserPipelineDiscovery] = {
    byIdFunc(id).filter(_.userId === user.id.get).firstOption
  }
}
