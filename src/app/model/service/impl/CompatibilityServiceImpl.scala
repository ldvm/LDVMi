package model.service.impl

import akka.actor.{Actor, Props, ActorRef}
import model.actor.CheckCompatibilityResponse
import model.entity._
import model.service.CompatibilityService
import model.service.component.{BindingContext, InternalComponent}
import play.api.db.slick._
import play.api.libs.concurrent.Akka
import play.api.libs.json.{Json, JsString, JsObject}
import scaldi.{Injectable, Injector}
import play.api.Play.current
import controllers.api.JsonImplicits._

class CompatibilityServiceImpl(implicit inj: Injector) extends CompatibilityService with Injectable {

  //val pipelineCompatibilityCheckRepository = inject[PipelineCompatibilityCheckRepository]

  def check(bindingSet: DataPortBindingSet, reporterProps: Props)(implicit session: Session) : DataPortBindingSetCompatibilityCheckId = {

    val pipelineCompatibilityCheck = DataPortBindingSetCompatibilityCheck(None, bindingSet.id.get, isFinished = false, isSuccess = None)
    val pipelineCompatibilityCheckId = save(pipelineCompatibilityCheck)

    val reporter = Akka.system.actorOf(reporterProps)
    reporter ! pipelineCompatibilityCheck

    val componentInstances = bindingSet.componentInstances

    componentInstances.map { componentInstance =>
      InternalComponent(componentInstance).check(BindingContext(bindingSet), reporterProps)
    }

    pipelineCompatibilityCheckId
  }

  def save(pipelineCompatibilityCheck: DataPortBindingSetCompatibilityCheck)(implicit session: Session) : DataPortBindingSetCompatibilityCheckId = {
    //pipelineCompatibilityCheckRepository.save(pipelineCompatibilityCheck)
    DataPortBindingSetCompatibilityCheckId(1)
  }
}
