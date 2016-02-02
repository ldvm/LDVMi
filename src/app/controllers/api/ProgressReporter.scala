package controllers.api

import akka.actor.{Actor, Props, ActorRef}
import controllers.api.JsonImplicits._
import model.actor.CheckCompatibilityResponse
import model.entity._
import play.api.libs.json._

case class PortCheckResult(isCompatible: Boolean, portUri: String, portOwnerComponentUri: String, sourceUri: String)

object ProgressReporter {
  def props(out: ActorRef) = Props(new ProgressReporter(out))
  def props = Props(new DummyReporter)
}

class DummyReporter extends Actor {
  def receive = {
    case _ =>
  }
}

class ProgressReporter(jsLogger: ActorRef) extends Actor {
  def receive = {
    case descriptorCheck: DescriptorCompatibilityCheck => {
      jsLogger ! Json.toJson(descriptorCheck)
    }
    case featureCheck: FeatureCompatibilityCheck => {
      jsLogger ! Json.toJson(featureCheck)
    }
    case componentInstanceCheck: ComponentInstanceCompatibilityCheck => {
      jsLogger ! Json.toJson(componentInstanceCheck)
    }
    case pipelineCheck: DataPortBindingSetCompatibilityCheck => {
      jsLogger ! Json.toJson(pipelineCheck)
    }
    case checkResponse: CheckCompatibilityResponse => {
      jsLogger ! Json.toJson(checkResponse)
    }
    case checkResponse: PortCheckResult => {
      jsLogger ! Json.toJson(checkResponse)
    }
    case i : PipelineEvaluationId => jsLogger ! JsObject(Seq(("id", JsNumber(i.id))))
    case j : JsValue => jsLogger ! j
    case msg: String => jsLogger ! JsObject(Seq(("message", JsString(msg))))
  }
}