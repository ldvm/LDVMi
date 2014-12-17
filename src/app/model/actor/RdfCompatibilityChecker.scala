package model.actor

import com.hp.hpl.jena.query.QueryExecutionFactory
import com.hp.hpl.jena.rdf.model.ModelFactory
import model.rdf.Graph

class RdfCompatibilityChecker(uri: String) extends CompatibilityChecker {
  def receive: Receive = {
    case CheckCompatibilityRequest(descriptor) => {
      try {
        val model = ModelFactory.createDefaultModel()
        model.read(uri, null, "N3")
        val qe = QueryExecutionFactory.create(descriptor.query, model)
        val result = qe.execAsk()
        sender() ! CheckCompatibilityResponse(Some(result), descriptor)
      } catch {
        case e: Throwable =>
          sender() ! akka.actor.Status.Failure(e)
          throw e
      }
    }
  }
}
