package model.service.component

import java.util.UUID

import akka.actor.Props
import model.rdf.sparql.GenericSparqlEndpoint
import play.api.libs.concurrent.Akka
import play.api.Play.current

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

class UnionPlugin(internalComponent: InternalComponent) extends AnalyzerPlugin {
  override def run(dataReferences: Seq[DataReference], reporterProps: Props): Future[(String, Option[String])] = {
    val endpointUrl = "http://live.payola.cz:8890/sparql"
    val resultGraph = "http://"+UUID.randomUUID().toString

    val reporter = Akka.system.actorOf(reporterProps)
    reporter ! "Running UNION"

    Future {
      val query = "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"

      dataReferences.map {dataRef =>
        val endpoint = new GenericSparqlEndpoint(dataRef.endpointUri, dataRef.graphUri.toSeq)
        val model = endpoint.queryExecutionFactory()(query).execConstruct()

        pushToTripleStore(model, endpointUrl, resultGraph)(reporterProps)
      }

      (endpointUrl, Some(resultGraph))
    }
  }
}
