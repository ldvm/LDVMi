package model.appgen.repository

import model.appgen.entity.{User, ApplicationId, Application, Applications}
import scala.slick.lifted.TableQuery
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class ApplicationsRepository extends BaseIdRepository[ApplicationId, Application, Applications](TableQuery[Applications]) {
  def findById(user: User, id: ApplicationId)(implicit session: Session): Option[Application] = {
    byIdFunc(id).filter(_.userId === user.id.get).firstOption
  }
}
