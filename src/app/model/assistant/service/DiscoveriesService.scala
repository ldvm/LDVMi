package model.assistant.service

import model.entity._
import model.assistant.entity._
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}
import utils.PaginationInfo
import CustomUnicornPlay.driver.simple._
import model.assistant.repository.UserPipelineDiscoveryRepository
import model.repository.PipelineDiscoveryRepository

/**
  * This discovery service works over PipelineDiscovery (original discovery from LinkedPipes) and
  * UserPipelineDiscovery (discovery extended by assistant related meta-data).
  */
class DiscoveriesService(implicit inj: Injector) extends Injectable {
  val userPipelineDiscoveryRepository = inject[UserPipelineDiscoveryRepository]
  val pipelineDiscoveryRepository = inject[PipelineDiscoveryRepository]

  protected def queryByUser(user: User) = {
    for {
      uPD <- userPipelineDiscoveriesQuery.filter(_.userId === user.id.get)
      pD <- pipelineDiscoveriesQuery if uPD.pipelineDiscoveryId === pD.id
    } yield (uPD, pD)
  }

  def findByUser(user: User)(implicit session: Session): Seq[Discovery] = {
    queryByUser(user)
      .list
      .map(Discovery.merge)
  }

  def findByUser(user: User, paginationInfo: PaginationInfo)(implicit session: Session): Seq[Discovery] = {
      queryByUser(user)
      .sortBy({ case (uPD, pD) => uPD.id.desc })
      .drop(paginationInfo.skipCount)
      .take(paginationInfo.pageSize)
      .list
      .map(Discovery.merge)
  }

  def countByUser(user: User)(implicit session: Session): Int = queryByUser(user).length.run

  def findById(user: User, id: UserPipelineDiscoveryId)(implicit session: Session): Option[Discovery] = {
    for {
      uPD <- userPipelineDiscoveryRepository.findById(id)
      pD <- pipelineDiscoveryRepository.findById(uPD.pipelineDiscoveryId)
    } yield Discovery.merge((uPD, pD))
  }

  def delete(discovery: Discovery)(implicit session: Session) = {
    // The PipelineDiscovery deletion is prevented by a FOREIGN KEY on pipelines table (and others
    // probably as well). That's for a good reason. Applications depend on pipelines and pipelines
    // depend on discoveries. So while there are existing applications based on a discovery, the
    // discovery cannot be deleted.
    // TODO: come up with a safe way to delete discoveries that are no longer required
    userPipelineDiscoveryRepository.deleteById(discovery.id.get)
  }
}
