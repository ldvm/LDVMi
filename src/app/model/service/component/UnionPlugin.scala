package model.service.component

import java.util.UUID

import akka.actor.Props
import model.entity.ComponentInstance
import model.rdf.sparql.GenericSparqlEndpoint
import model.service.GraphStoreProtocol
import play.api.Play.current
import play.api.libs.concurrent.Akka

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class UnionPlugin(internalComponent: InternalComponent, graphStore: GraphStoreProtocol) extends AnalyzerPlugin {
  override def run(dataReferences: Seq[DataReference], reporterProps: Props): Future[(String, Option[String])] = {
    val resultGraph = "urn:" + UUID.randomUUID().toString

    val reporter = Akka.system.actorOf(reporterProps)
    reporter ! "Running UNION"

    Future {
      dataReferences.map { dataRef =>

        try {

          val query = "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"

          val endpoint = new GenericSparqlEndpoint(dataRef.endpointUri,dataRef.graphUri.toSeq, List())

          val model = endpoint.queryExecutionFactory()(query).execConstruct()
          graphStore.pushToTripleStore(model, resultGraph)(reporterProps)
        } catch {
          case e: org.apache.jena.atlas.web.HttpException => {
            println(e.getResponse)
          }
          case e: Throwable => {
            println(e)
          }
        }
      }

      (graphStore.internalEndpointUrl, Some(resultGraph))
    }
  }

  override def componentInstance: ComponentInstance = internalComponent.componentInstance
}
