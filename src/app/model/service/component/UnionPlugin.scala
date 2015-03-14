package model.service.component

import java.util.UUID

import akka.actor.Props
import model.entity.ComponentInstance
import model.rdf.sparql.GenericSparqlEndpoint
import play.api.Play.current
import play.api.libs.concurrent.Akka

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class UnionPlugin(internalComponent: InternalComponent) extends AnalyzerPlugin {
  override def run(dataReferences: Seq[DataReference], reporterProps: Props): Future[(String, Option[String])] = {
    val endpointUrl = "http://live.payola.cz:8890/sparql"
    val resultGraph = "urn:" + UUID.randomUUID().toString

    val reporter = Akka.system.actorOf(reporterProps)
    reporter ! "Running UNION"

    Future {
      dataReferences.map { dataRef =>

        try {

          val query = "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"

          val endpoint = new GenericSparqlEndpoint(dataRef.endpointUri,dataRef.graphUri.toSeq, List())

          val model = endpoint.queryExecutionFactory()(query).execConstruct()
          pushToTripleStore(model, endpointUrl, resultGraph)(reporterProps)
        } catch {
          case e: org.apache.jena.atlas.web.HttpException => {
            println(e.getResponse)
          }
          case e: Throwable => {
            println(e)
          }
        }
      }

      (endpointUrl, Some(resultGraph))
    }
  }

  override def componentInstance: ComponentInstance = internalComponent.componentInstance
}
