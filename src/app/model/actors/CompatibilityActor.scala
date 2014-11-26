package model.actors

import akka.actor.Actor
import model.entity.DataSourceEagerBox
import model.rdf.sparql.GenericSparqlEndpoint

case class CheckCompatibility(dataSourceBox: DataSourceEagerBox, signature: String, featureId: Long)

class CompatibilityActor extends Actor {
  def receive: Receive = {
    case CheckCompatibility(dataSourceBox, signature, featureId) => {
      try {
        val queryExecutionFactory = GenericSparqlEndpoint(dataSourceBox).queryExecutionFactory()
        val qe = queryExecutionFactory(signature)
        sender() !(qe.execAsk(), featureId)
      } catch {
        case e: Exception =>
          sender() ! akka.actor.Status.Failure(e)
          throw e
      }
    }
  }
}
