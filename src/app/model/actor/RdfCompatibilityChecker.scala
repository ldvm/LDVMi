package model.actor

import org.apache.jena.query.QueryExecutionFactory
import org.apache.jena.rdf.model.ModelFactory

class RdfCompatibilityChecker(uri: String) extends CompatibilityChecker {
  def receive: Receive = {
    case CheckCompatibilityRequest(descriptor) => {
      try {
        val model = ModelFactory.createDefaultModel()
        model.read(uri, null, "N3")
        val qe = QueryExecutionFactory.create(descriptor.query, model)
        val result = qe.execAsk()
        sender() ! CheckCompatibilityResponse(Some(result), descriptor, rdfUri = Some(uri))
      } catch {
        case e: Throwable =>
          sender() ! akka.actor.Status.Failure(e)
          throw e
      }
    }
  }
}
