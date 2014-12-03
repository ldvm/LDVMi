package model.component

import _root_.controllers.api.dto
import model.entity._
import model.repository.OutputRepository
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class OutputComponentImpl(implicit inj: Injector)
  extends OutputComponent with Injectable {

  val repository = inject[OutputRepository]
  val dataPortComponent = inject[DataPortComponent]

  def save(output: dto.Output, componentId: ComponentId)(implicit session: Session): OutputId = {

    val dataPortEntityId = dataPortComponent.save(output.dataPort, componentId)

    val outputEntity = Output(
      None,
      output.dataSample,
      dataPortEntityId,
      componentId
    )

    save(outputEntity)
  }

}