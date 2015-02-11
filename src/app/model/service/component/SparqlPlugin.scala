package model.service.component

import java.util.UUID

import model.rdf.Graph
import model.rdf.sparql.GenericSparqlEndpoint

import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class SparqlPlugin(internalComponent: InternalComponent) extends AnalyzerPlugin {
  override def run(dataReferences: Seq[DataReference]): Future[(String, Option[String])] = {
    val endpointUrl = "http://live.payola.cz:8890/sparql"
    val resultGraph = "http://" + UUID.randomUUID().toString

    Future {
      val query = sparqlQuery(internalComponent.componentInstance.configuration).get

      val dataRef = dataReferences.head
      val endpoint = new GenericSparqlEndpoint(dataRef.endpointUri, dataRef.graphUri.toSeq)
      val model = endpoint.queryExecutionFactory()(query).execConstruct()

      pushToTripleStore(model, endpointUrl, resultGraph)

      (endpointUrl, Some(resultGraph))
    }
  }

  private def sparqlQuery(ttl: Option[String]): Option[String] = {
    Graph(ttl).flatMap { g =>
      g.jenaModel
        .listObjectsOfProperty(g.jenaModel.createProperty("http://linked.opendata.cz/resource/ldvm/analyzer/sparql/query"))
        .toList
        .headOption
        .map(_.asLiteral().getString)
    }
  }
}
