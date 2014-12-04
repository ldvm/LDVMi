package model.component

import controllers.api.dto
import model.entity.{ComponentId, DataPort, DataPortId, DataPortTable}
import model.repository.DataPortRepository
import play.api.db.slick._

trait DataPortService extends CrudService[DataPortId, DataPort, DataPortTable, DataPortRepository] {

  def save(dataPort: dto.DataPort, componentId: ComponentId)(implicit session: Session): DataPortId

}