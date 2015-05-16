package model.service.impl

import akka.actor.{Actor, Props, ActorRef}
import controllers.api.ProgressReporter
import model.actor.CheckCompatibilityResponse
import model.entity._
import model.repository.DataPortBindingSetCompatibilityCheckRepository
import model.service.CompatibilityService
import model.service.component.{BindingContext, InternalComponent}
import play.api.db.slick._
import play.api.libs.concurrent.Akka
import play.api.libs.json.{Json, JsString, JsObject}
import scaldi.{Injectable, Injector}
import play.api.Play.current
import controllers.api.JsonImplicits._

class CompatibilityServiceImpl(implicit inj: Injector) extends CompatibilityService with Injectable {

  val dataPortBindingSetCompatibilityCheckRepository = inject[DataPortBindingSetCompatibilityCheckRepository]

  def check(bindingSet: DataPortBindingSet, reporterProps: Props)(implicit session: Session) : DataPortBindingSetCompatibilityCheckId = {

    var pipelineCompatibilityCheck = DataPortBindingSetCompatibilityCheck(None, bindingSet.id.get, isFinished = false, isSuccess = None)
    val dpbsCompatibilityCheckId = save(pipelineCompatibilityCheck)
    pipelineCompatibilityCheck = pipelineCompatibilityCheck.copy(id = Some(dpbsCompatibilityCheckId))

    val reporter = Akka.system.actorOf(reporterProps)
    reporter ! pipelineCompatibilityCheck

    val componentInstances = bindingSet.componentInstances

    componentInstances.foreach { componentInstance =>
      InternalComponent(componentInstance, ProgressReporter.props)
        .check(BindingContext(bindingSet))
    }

    dpbsCompatibilityCheckId
  }

  def save(pipelineCompatibilityCheck: DataPortBindingSetCompatibilityCheck)(implicit session: Session) : DataPortBindingSetCompatibilityCheckId = {
    dataPortBindingSetCompatibilityCheckRepository.save(pipelineCompatibilityCheck)
  }
}
