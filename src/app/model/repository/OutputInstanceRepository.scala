package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class OutputInstanceRepository extends CrudRepository[OutputInstanceId, OutputInstance, OutputInstanceTable](TableQuery[OutputInstanceTable]) {
  
  def findByDataPort(portInstance: DataPortInstance)(implicit session: Session) : Option[OutputInstance] = {
    query.filter(_.dataPortInstanceId === portInstance.id).firstOption
  }
  
}
