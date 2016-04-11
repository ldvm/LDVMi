package model.rdf.sparql.rgml

import model.entity.PipelineEvaluation
import model.rdf.sparql.rgml.extractor.{EdgesExtractor, GraphExtractor, NodesExtractor}
import model.rdf.sparql.rgml.query.{EdgesQuery, GraphQuery, NodesQuery}
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

import scala.collection.mutable

class RgmlServiceImpl(implicit val inj: Injector) extends RgmlService with Injectable {
  var sparqlEndpointService = inject[SparqlEndpointService]

  override def graph(evaluation: PipelineEvaluation)(implicit session: Session): Option[Graph] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new GraphQuery(),
      new GraphExtractor())
  }

  override def edges(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Edge]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new EdgesQuery(),
      new EdgesExtractor())
  }

  override def nodes(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Node]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new NodesQuery(),
      new NodesExtractor())
  }

  def matrix(evaluation: PipelineEvaluation, nodeUris: Seq[String])(implicit session: Session): Option[Seq[Seq[Double]]] = {
    (for {
      graph <- graph(evaluation)
      edges <- edges(evaluation)
    } yield (graph, edges)) match {
      case Some((graph, edges)) =>
        val urisSet = nodeUris.toSet

        // Adjacency matrix of the graph that takes into account weight of the edges.
        val matrix: mutable.Map[String, mutable.Map[String, Double]] = mutable.Map()

        // Update the adjacency matrix using an edge going from source to target.
        def addEdge(source: String, target: String, weight: Double) {
          val counts = matrix.getOrElse(source, mutable.Map())
          counts.put(target, counts.getOrElse(target, 0.0) + weight)
          matrix.put(source, counts)
        }

        // Go through all edges and take only those that are between selected nodes.
        edges.foreach(edge => {
          if (urisSet.contains(edge.source) && urisSet.contains(edge.target)) {
            addEdge(edge.source, edge.target, edge.weight)

            if (!graph.directed) {
              addEdge(edge.target, edge.source, edge.weight)
            }
          }
        })

        // Let's remove the uris and create a pure matrix of doubles (two-dimensional array/list).
        // We have to be careful to maintain the order.

        Some(nodeUris.map(source =>
          nodeUris.map(target =>
            matrix.getOrElse(source, mutable.Map()).getOrElse(target, 0.0)
          )
        ))

      case None => None
    }
  }

  private def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation)(implicit session: Session): GenericSparqlEndpoint = {
    val evaluationResults = evaluation.results
    evaluationResults.map { result =>
      new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.map(_.split("\n").toSeq).getOrElse(Seq()))
    }.head
  }
}
