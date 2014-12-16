package model.repository

import model.entity._
import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class OutputRepository extends CrudRepository[OutputId, Output, OutputTable](TableQuery[OutputTable]){
  def findByDataPort(dataPort: DataPort)(implicit session: Session) : Option[Output] = {
    query.filter(_.dataPortId === dataPort.id).firstOption
  }
}
