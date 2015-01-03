package model.repository

import model.entity._
import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class OutputTemplateRepository extends CrudRepository[OutputId, Output, OutputTable](TableQuery[OutputTable]){
  def findByDataPort(dataPort: DataPortTemplate)(implicit session: Session) : Option[Output] = {
    query.filter(_.dataPortId === dataPort.id).firstOption
  }
}
