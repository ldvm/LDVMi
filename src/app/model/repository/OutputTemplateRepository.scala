package model.repository

import model.entity._
import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class OutputTemplateRepository extends CrudRepository[OutputTemplateId, OutputTemplate, OutputTemplateTable](TableQuery[OutputTemplateTable]){
  def findByDataPort(dataPort: DataPortTemplate)(implicit session: Session) : Option[OutputTemplate] = {
    query.filter(_.dataPortTemplateId === dataPort.id).firstOption
  }
}
