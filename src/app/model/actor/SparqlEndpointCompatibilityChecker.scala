package model.actor

import model.rdf.Graph
import model.rdf.sparql.GenericSparqlEndpoint

class SparqlEndpointNotConfiguredException extends Throwable

class SparqlEndpointCompatibilityChecker(componentInstanceConfiguration: Option[Graph], componentConfiguration: Option[Graph]) extends CompatibilityChecker {
  def receive: Receive = {
    case CheckCompatibilityRequest(descriptor) => {
      try {
        val endpointOption = GenericSparqlEndpoint(componentInstanceConfiguration, componentConfiguration)
        endpointOption.map { endpoint =>
          val queryExecutionFactory = endpoint.queryExecutionFactory()
          val qe = queryExecutionFactory(descriptor.query)
          sender() ! CheckCompatibilityResponse(Some(qe.execAsk()), descriptor)
        }.getOrElse {
          sender() ! CheckCompatibilityResponse(None, descriptor)
        }
      } catch {
        case e: Throwable =>
          sender() ! akka.actor.Status.Failure(e)
          throw e
      }
    }
  }
}
