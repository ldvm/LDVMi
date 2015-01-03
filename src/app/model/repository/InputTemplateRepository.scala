package model.repository

import model.entity._

import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class InputTemplateRepository extends CrudRepository[InputTemplateId, InputTemplate, InputTemplateTable](TableQuery[InputTemplateTable]) {

  def findByDataPort(dataPort: DataPortTemplate)(implicit session: Session) : Option[InputTemplate] = {
    query.filter(_.dataPortTemplateId === dataPort.id).firstOption
  }

}
