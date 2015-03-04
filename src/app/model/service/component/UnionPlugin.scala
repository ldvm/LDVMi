package model.service.component

import java.util.UUID

import akka.actor.Props
import model.rdf.sparql.GenericSparqlEndpoint
import play.api.Play.current
import play.api.libs.concurrent.Akka

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class UnionPlugin(internalComponent: InternalComponent) extends AnalyzerPlugin {
  override def run(dataReferences: Seq[DataReference], reporterProps: Props): Future[(String, Option[String])] = {
    val endpointUrl = "http://live.payola.cz:8890/sparql"
    val resultGraph = "http://" + UUID.randomUUID().toString

    val reporter = Akka.system.actorOf(reporterProps)
    reporter ! "Running UNION"

    Future {
      val query = "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"

      println(dataReferences)

      dataReferences.map { dataRef =>
        val endpoint = new GenericSparqlEndpoint(dataRef.endpointUri, List(), dataRef.graphUri.toSeq)

        try {
          /*if (false && sameEndpoint) {
            val updateQuery = query.replaceAll("^(?i)construct", "WITH <" + resultGraph + "> INSERT")
            endpoint.updateExecutionFactory()(updateQuery).execute()
          } else {*/
            val model = endpoint.queryExecutionFactory()(query).execConstruct()
            pushToTripleStore(model, endpointUrl, resultGraph)(reporterProps)
          //}
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
}
