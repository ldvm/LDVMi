package model.service.component

import java.util.UUID

import model.rdf.sparql.GenericSparqlEndpoint

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

class UnionPlugin(internalComponent: InternalComponent) extends AnalyzerPlugin {
  override def run(dataReferences: Seq[DataReference]): Future[(String, Option[String])] = {
    val endpointUrl = "http://live.payola.cz:8890/sparql"
    val resultGraph = "http://"+UUID.randomUUID().toString

    println("running union")

    Future {
      val query = "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"

      dataReferences.map {dataRef =>
        val endpoint = new GenericSparqlEndpoint(dataRef.endpointUri, dataRef.graphUri.toSeq)
        val model = endpoint.queryExecutionFactory()(query).execConstruct()

        pushToTripleStore(model, endpointUrl, resultGraph)
      }

      (endpointUrl, Some(resultGraph))
    }
  }
}
