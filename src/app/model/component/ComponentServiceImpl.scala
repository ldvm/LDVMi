package model.component

import _root_.controllers.api.dto
import model.entity.{Component, ComponentId}
import model.repository.ComponentRepository
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class ComponentServiceImpl(implicit inj: Injector) extends ComponentService with Injectable {

  val repository = inject[ComponentRepository]
  val outputComponent = inject[OutputService]
  val featureComponent = inject[FeatureService]
  val inputComponent = inject[InputService]

  def save(component: dto.Component)(implicit session: Session): ComponentId = {

    val componentEntity = Component(
      None,
      component.uri,
      component.label.getOrElse("Unlabeled component"),
      component.comment,
      component.configuration
    )

    val componentId = save(componentEntity)

    component.output.map { o =>
      outputComponent.save(o, componentId)
    }

    val inputIdsByUri = component.inputs.map { i =>
      (i.dataPort.uri, inputComponent.save(i, componentId))
    }.toMap

    component.features.map { f =>
      featureComponent.save(f, inputIdsByUri, componentId)
    }

    componentId
  }

}