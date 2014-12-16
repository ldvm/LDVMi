package model.repository

import model.entity._

import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class InputRepository extends CrudRepository[InputId, Input, InputTable](TableQuery[InputTable]) {

  def findByDataPort(dataPort: DataPort)(implicit session: Session) : Option[Input] = {
    query.filter(_.dataPortId === dataPort.id).firstOption
  }

}
