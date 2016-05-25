package model.appgen.repository

import model.appgen.entity.{Application, ApplicationId, Applications, User}

import scala.slick.lifted.TableQuery
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import utils.PaginationInfo

class ApplicationsRepository extends BaseIdRepository[ApplicationId, Application, Applications](TableQuery[Applications]) {
  def findById(user: User, id: ApplicationId)(implicit session: Session): Option[Application] = {
    byIdFunc(id).filter(_.userId === user.id.get).firstOption
  }

  def findPublished(implicit session: Session): Seq[Application] = {
    // TODO: use actual date of publishing
    // TODO: implement sorting
    query.filter(_.published === true).list
  }

  def findByUser(user: User)(implicit session: Session): Seq[Application] = {
    query.filter(_.userId === user.id.get).sortBy(_.id.desc).list
  }

  def findByUser(user: User, paginationInfo: PaginationInfo)(implicit session: Session): Seq[Application] = {
    query
      .filter(_.userId === user.id.get)
      .sortBy(_.id.desc)
      .drop(paginationInfo.skipCount)
      .take(paginationInfo.pageSize)
      .list
  }

  def countByUser(user: User)(implicit session: Session): Int = {
    query.filter(_.userId === user.id.get).length.run
  }
}
