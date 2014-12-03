package model.component

import _root_.controllers.api.dto
import model.entity._
import model.repository.InputRepository
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class InputComponentImpl(implicit inj: Injector)
  extends InputComponent with Injectable {

  val repository = inject[InputRepository]
  val dataPortComponent = inject[DataPortComponent]

  def save(input: dto.Input, componentId: ComponentId)(implicit session: Session): InputId = {

    val dataPortEntityId = dataPortComponent.save(input.dataPort, componentId)

    val inputEntity = Input(
      None,
      dataPortEntityId,
      componentId
    )

    save(inputEntity)
  }


}