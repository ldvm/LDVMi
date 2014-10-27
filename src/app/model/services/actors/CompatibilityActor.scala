package model.services.actors

import akka.actor.Actor
import com.hp.hpl.jena.query.QueryExecutionFactory
import model.dao.DataSource
import model.services.rdf.sparql.GenericSparqlEndpoint

import scala.collection.JavaConversions._

case class CheckCompatibility(dataSource: DataSource, signature: String)

class CompatibilityActor extends Actor {
  def receive: Receive = {
    case CheckCompatibility(dataSource, signature) => {
      try {
        val sparqlEndpoint = GenericSparqlEndpoint(dataSource)
        val qe = QueryExecutionFactory.sparqlService(sparqlEndpoint.endpointURL, signature, sparqlEndpoint.namedGraphs, List())
        sender() ! qe.execAsk()
      } catch {
        case e: Exception =>
          sender() ! akka.actor.Status.Failure(e)
          throw e
      }
    }
  }
}
