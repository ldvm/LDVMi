package model.component

import controllers.api.dto
import model.entity.{ComponentId, Input, InputId, InputTable}
import model.repository.InputRepository
import play.api.db.slick._

trait InputService extends CrudService[InputId, Input, InputTable, InputRepository] {

  def save(input: dto.Input, componentId: ComponentId)(implicit session: Session): InputId

}
