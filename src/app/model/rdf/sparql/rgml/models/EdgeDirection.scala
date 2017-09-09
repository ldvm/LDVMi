package model.rdf.sparql.rgml.models

import play.api.libs.json._

object EdgeDirection extends Enumeration {
  type EdgeDirection = Value
  val Incoming = Value("incoming")
  val Outgoing = Value("outgoing")

  implicit val edgeDirectionFormat = new Format[EdgeDirection] {
    def reads(json: JsValue) = JsSuccess(EdgeDirection.withName(json.as[String]))
    def writes(direction: EdgeDirection) = JsString(direction.toString)
  }
}

