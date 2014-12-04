package model.component

import _root_.controllers.api.dto
import model.entity._
import model.repository.DataPortRepository
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class DataPortServiceImpl(implicit inj: Injector) extends DataPortService with Injectable {

  val repository = inject[DataPortRepository]

  def save(dataPort: dto.DataPort, componentId: ComponentId)(implicit session: Session): DataPortId = {
    val dataPortEntity = DataPort(
      None,
      componentId,
      dataPort.title.getOrElse("Unlabeled data port"),
      dataPort.description
    )
    save(dataPortEntity)
  }

}