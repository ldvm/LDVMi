package model.appgen.service

import model.entity._
import model.appgen.entity._
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}
import utils.PaginationInfo

import CustomUnicornPlay.driver.simple._

/**
  * This discovery service works over PipelineDiscovery (original discovery from LinkedPipes) and
  * UserPipelineDiscovery (discovery extended by appgen related meta-data).
  */
class DiscoveriesService(implicit inj: Injector) extends Injectable {

  protected def queryByUser(user: User) = {
    for {
      uPD <- userPipelineDiscoveriesQuery.filter(_.userId === user.id.get)
      pD <- pipelineDiscoveriesQuery if uPD.pipelineDiscoveryId === pD.id
    } yield (uPD, pD)
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
}
