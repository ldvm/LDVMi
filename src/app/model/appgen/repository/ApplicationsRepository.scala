package model.appgen.repository

import model.appgen.entity.{User, ApplicationId, Application, Applications}
import scala.slick.lifted.TableQuery
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class ApplicationsRepository extends BaseIdRepository[ApplicationId, Application, Applications](TableQuery[Applications]) {
  def findById(user: User, id: ApplicationId)(implicit session: Session): Option[Application] = {
    byIdFunc(id).filter(_.userId === user.id.get).firstOption
  }

  def findPublished(implicit session: Session): Seq[Application] = {
    // TODO: use actual date of publishing
    // TODO: implement sorting
    findAll().filter(_.published == true)
  }

  def findByUser(user: User)(implicit session: Session): Seq[Application] = {
    // TODO: implement sorting
    findAll().filter(_.userId == user.id.get)
  }
}
