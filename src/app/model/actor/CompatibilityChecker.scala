package model.actor

import akka.actor.Actor
import model.entity.Descriptor

case class CheckCompatibilityRequest(descriptor: Descriptor)
case class CheckCompatibilityResponse(isCompatible: Option[Boolean], descriptor: Descriptor, rdfUri: Option[String] = None, sourceUri: Option[String] = None)

trait CompatibilityChecker extends Actor