package model.service.component

import java.util.UUID

import akka.actor.Props
import model.rdf.Graph
import model.rdf.sparql.GenericSparqlEndpoint
import play.api.libs.concurrent.Akka

import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import play.api.Play.current

class SparqlPlugin(internalComponent: InternalComponent) extends AnalyzerPlugin {
  override def run(dataReferences: Seq[DataReference], reporterProps: Props): Future[(String, Option[String])] = {

    val endpointUrl = "http://live.payola.cz:8890/sparql"
    val resultGraph = "urn:" + UUID.randomUUID().toString

    val reporter = Akka.system.actorOf(reporterProps)

    Future {
      try {
        val query = sparqlQuery(internalComponent.componentInstance.configuration).get

        val dataRef = dataReferences.head
        val graphUris = dataRef.graphUri.map { u => Seq(u)}.getOrElse {List()}
        val endpoint = new GenericSparqlEndpoint(dataRef.endpointUri, List(), graphUris)

        reporter ! "Querying "+dataRef.endpointUri+"@"+dataRef.graphUri.toString
        val model = endpoint.queryExecutionFactory()(query).execConstruct()

        pushToTripleStore(model, endpointUrl, resultGraph)(reporterProps)
      } catch {
        case e: Throwable => println(e)
      }

      (endpointUrl, Some(resultGraph))
    }
  }

  private def sparqlQuery(ttl: Option[String]): Option[String] = {
    Graph(ttl).flatMap { g =>
      val jenaModel = g.jenaModel
      val queryObjects = jenaModel.listObjectsOfProperty(g.jenaModel.createProperty("http://linked.opendata.cz/ontology/ldvm/analyzer/sparql/query")).toList
      queryObjects.headOption.map(_.asLiteral().getString)
    }
  }
}
