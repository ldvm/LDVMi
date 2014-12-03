package model.component

import controllers.api.dto
import model.entity.{ComponentId, OutputTable, Output, OutputId}
import model.repository.OutputRepository
import play.api.db.slick._

trait OutputComponent extends CrudComponent[OutputId, Output, OutputTable, OutputRepository] {

  def save(output: dto.Output, componentId: ComponentId)(implicit session: Session): OutputId

}
