package model.rdf.sparql.rgml.extractor

import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.{Graph, Node}
import model.rdf.sparql.rgml.query.NodesQuery
import model.rdf.vocabulary.RGML
import org.apache.jena.query.QueryExecution
import org.apache.jena.vocabulary.{RDF, RDFS}

import scala.collection.JavaConversions._

class NodesExtractor(graph: Graph) extends QueryExecutionResultExtractor[NodesQuery, Seq[Node]] {

  def extract(input: QueryExecution): Option[Seq[Node]] = {

    try {
      val model = input.execConstruct()
      val nodeStatements = model.listResourcesWithProperty(RDF.`type`, RGML.Node).toList

      Some(nodeStatements.map { s =>
        val resource = s.asResource()
        val label = LocalizedValue.create(resource, RDFS.label)
        val inDegree = resource.getProperty(RGML.inDegree).getInt
        val outDegree = resource.getProperty(RGML.outDegree).getInt

        Node(resource.getURI, Some(label),
          if (graph.directed) inDegree else inDegree + outDegree,
          if (graph.directed) outDegree else inDegree + outDegree
        )
      })
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }

  }
}
