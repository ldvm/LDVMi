package model.rdf.sparql.rgml

import model.entity.PipelineEvaluation
import model.rdf.sparql.rgml.extractor._
import model.rdf.sparql.rgml.query._
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}
import model.rdf.sparql.rgml.EdgeDirection._
import utils.Profiler

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

  override def nodes(evaluation: PipelineEvaluation, offset: Integer, limit: Integer)(implicit session: Session): Option[Seq[Node]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new NodesQuery(Some(offset), Some(limit)),
      new NodesExtractor())
  }

  override def nodes(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Option[Seq[Node]] = {
    // Okay, for really large graphs it would be more efficient to load only the nodes that are
    // required but for the current visualizers' purposes this "dumb" approach is alright.
    nodes(evaluation) map { nodes =>
      val urisSet = uris.toSet
      nodes.filter(node => urisSet.contains(node.uri))
    }
  }


  override def nodesWithDegree(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[NodeWithDegree]] = {
    graph(evaluation) flatMap { graph =>
      sparqlEndpointService.getResult(
        evaluationToSparqlEndpoint(evaluation),
        new NodesWithDegreeQuery(),
        new NodesWithDegreeExtractor(graph))
    }
  }

  def matrix(evaluation: PipelineEvaluation, nodeUris: Seq[String])(implicit session: Session): Option[Seq[Seq[Double]]] = {
    (for {
      graph <- graph(evaluation)
      edges <- Some(nodeUris.flatMap(uri => {
        // Let's fetch incident edges for all required nodes. Some edges might be selected multiple
        // times and some edges we don't need at all but we're still making only O(n) SPARQL
        // requests this approach works also for very large graphs.
        if (graph.directed)
          Seq(incidentEdges(evaluation, uri, Outgoing), incidentEdges(evaluation, uri, Incoming))
        else
          Seq(incidentEdges(evaluation, uri))
        }).flatten.reduceLeft((result, edges) => result ++ edges).toSet)
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

  override def incidentEdges(evaluation: PipelineEvaluation, nodeUri: String, direction: EdgeDirection = Outgoing)(implicit session: Session): Option[Seq[Edge]] = {
    graph(evaluation) flatMap { graph =>
      sparqlEndpointService.getResult(
        evaluationToSparqlEndpoint(evaluation),
        new IncidentEdgesQuery(graph, nodeUri, direction),
        new EdgesExtractor)
    }
  }

  override def adjacentNodes(evaluation: PipelineEvaluation, nodeUri: String, direction: EdgeDirection = Outgoing)(implicit session: Session): Option[Seq[Node]] = {
    graph(evaluation) flatMap { graph =>
      sparqlEndpointService.getResult(
        evaluationToSparqlEndpoint(evaluation),
        new AdjacentNodesQuery(graph, nodeUri, direction),
        new NodesExtractor)
    }
  }

  // TODO: override
  def sampleNodesByHighestDegree(evaluation: PipelineEvaluation, size: Int)(implicit session: Session): Option[Seq[Node]] = {
    // Get 'size' nodes with the highest out degree and lets hope there will be something to visualize
    Some(nodesWithDegree(evaluation).getOrElse(Seq.empty).sortBy(-_.outDegree)
      .take(size).map(node => Node(node.uri, node.label)))
  }

  // TODO: override
  override def sampleNodesWithForrestFire(
    evaluation: PipelineEvaluation,
    size: Int,
    useWeights: Boolean = true,
    pF: Double = 0.2,
    pB: Double = 0.05)(implicit session: Session):
  Option[Seq[Node]] = {

    val random = scala.util.Random
    val g = graph(evaluation).get

    if (g == null) { // Not exactly Scala way but what the heck
      return None
    }

    def randomNode: Node = nodes(evaluation, random.nextInt(g.nodeCount), 1).get.head

    def burn(sample: Set[String], node: String): Set[String] = {
      if (sample.size == size || sample.contains(node)) {
        return sample
      }

      spread(node).foldLeft(sample + node)(burn)
    }

    def spread(node: String): Seq[String] = {
      if (g.directed)
        spreadInDirection(node, Outgoing, pF) ++ spreadInDirection(node, Incoming, pB)
      else
        spreadInDirection(node, Outgoing, pF)
    }

    def spreadInDirection(node: String, direction: EdgeDirection, p: Double): Seq[String] = {
      incidentEdges(evaluation, node, direction).getOrElse(Seq())
        .filter(edge => choose(edge, p))
        .map(edge => if (edge.source == node) edge.target else edge.source)
    }

    def choose(edge: Edge, p: Double): Boolean = {
      random.nextFloat() < 1 - Math.pow(1 - p, if (useWeights) edge.weight else 1)
    }

    var sample = Set.empty[String]
    while (sample.size < size && sample.size < g.nodeCount) {
      sample = burn(sample, randomNode.uri)
    }

    nodes(evaluation, sample.toSeq)
  }

  private def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation)(implicit session: Session): GenericSparqlEndpoint = {
    val evaluationResults = evaluation.results
    evaluationResults.map { result =>
      new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.map(_.split("\n").toSeq).getOrElse(Seq()))
    }.head
  }
}
