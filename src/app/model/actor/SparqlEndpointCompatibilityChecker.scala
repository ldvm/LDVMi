package model.actor

import model.rdf.Graph
import model.rdf.sparql.GenericSparqlEndpoint
import org.apache.jena.atlas.web.HttpException

class SparqlEndpointNotConfiguredException extends Throwable

class SparqlEndpointCompatibilityChecker(componentInstanceConfiguration: Option[Graph], componentConfiguration: Option[Graph], componentUri: String) extends CompatibilityChecker {
  def receive: Receive = {
    case CheckCompatibilityRequest(descriptor) => {
      try {
        val endpointOption = GenericSparqlEndpoint(componentInstanceConfiguration, componentConfiguration)
        endpointOption.map { endpoint =>

          val queryExecutionFactory = endpoint.queryExecutionFactory()
          val qe = queryExecutionFactory(descriptor.query)
          val result = qe.execAsk()
          sender() ! CheckCompatibilityResponse(Some(result), descriptor, sourceUri = Some(componentUri))
        }.getOrElse {
          sender() ! CheckCompatibilityResponse(None, descriptor, sourceUri = Some(componentUri))
        }
      } catch {
        case he: com.hp.hpl.jena.sparql.engine.http.QueryExceptionHTTP => {
          sender() ! akka.actor.Status.Failure(he)
        }
        case e: com.hp.hpl.jena.query.QueryException => {
          sender() ! akka.actor.Status.Failure(e)
        }
        case e: Throwable =>
          sender() ! akka.actor.Status.Failure(e)
          e.printStackTrace()
      }
    }
  }
}
