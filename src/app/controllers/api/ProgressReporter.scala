package controllers.api

import akka.actor.{Actor, Props, ActorRef}
import controllers.api.JsonImplicits._
import model.actor.CheckCompatibilityResponse
import model.entity.{DataPortBindingSetCompatibilityCheck, ComponentInstanceCompatibilityCheck, FeatureCompatibilityCheck, DescriptorCompatibilityCheck}
import play.api.libs.json.{JsValue, Json, JsString, JsObject}

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
    case r : CheckCompatibilityResponse => jsLogger ! Json.toJson(r)
    case j: JsValue => jsLogger ! j
    case msg: String => jsLogger ! JsObject(Seq(("message", JsString(msg))))
  }
}