package model.actor

import com.hp.hpl.jena.query.QueryExecutionFactory
import model.rdf.Graph

class RdfCompatibilityChecker(dataSample: Option[Graph]) extends CompatibilityChecker {
  def receive: Receive = {
    case CheckCompatibilityRequest(descriptor) => {
      try {
        val qe = QueryExecutionFactory.create(descriptor.query, dataSample.get.jenaModel)
        println("asking" + descriptor.query)
        sender() !(qe.execAsk(), descriptor)
      } catch {
        case e: Throwable =>
          sender() ! akka.actor.Status.Failure(e)
          throw e
      }
    }
  }
}
