package model.appgen.repository

import model.appgen.entity.{ApplicationId, Application, Applications}
import scala.slick.lifted.TableQuery
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class ApplicationsRepository extends BaseIdRepository[ApplicationId, Application, Applications](TableQuery[Applications])
