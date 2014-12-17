package model.actor

import akka.actor.Actor
import model.entity.Descriptor

case class CheckCompatibilityRequest(descriptor: Descriptor)
case class CheckCompatibilityResponse(isCompatible: Option[Boolean], descriptor: Descriptor)

trait CompatibilityChecker extends Actor