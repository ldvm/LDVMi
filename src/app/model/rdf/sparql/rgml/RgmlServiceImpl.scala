package model.rdf.sparql.rgml

import model.entity.PipelineEvaluation
import model.rdf.sparql.rgml.extractor._
import model.rdf.sparql.rgml.models.EdgeDirection._
import model.rdf.sparql.rgml.models.{EdgeDirection => _, _}
import model.rdf.sparql.rgml.query._
import model.rdf.sparql.{EvaluationToSparqlEndpoint, SparqlEndpointService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

import scala.collection.mutable

/** Service for fetching RDF graph data described using rgml vocabulary.
  *
  * Note 1: To avoid confusion, whenever the term "graph" is used within this file, we have in mind
  * an actual graph structure described using rgml vocabulary, not the RDF graph.
  *
  * Note 2: The rgml vocabulary defines three main concepts (type of resources): rgml:Graph,
  * rgml:Edge and rgml:Node. Instances of rgml:Node and rgml:Edge are tied to an instance of
  * rgml:Graph which creates a single graph. Unfortunately, rgml vocabulary uses RDF collections
  * to define which nodes and edges belong to a graph. RDF collections are a bit complicated to
  * work with using standard SPARQL queries (at least to our current best knowledge). Therefore
  * we simply consider all nodes and edges within a data set to belong to the same graph. All
  * following methods are built on top of this assumption.
  *
  * In certain cases, this might cause undesired behavior. The instance of rgml:Graph contains
  * information about whether the graph is directed or undirected. If the data set contains
  * two graphs from which one is directed and one is undirected, our ability to extract any useful
  * information out the data set is significantly reduced because we are missing the information
  * about which edge belongs to which graph, i. e. which edge is directed and which is undirected.
  *
  * Note 3: Usually the term "vertex" is more common than "node" in graph theory. The rgml
  * vocabulary, however, sticks to the term "node" and to keep the code consistent, we decided
  * to follow this decision.
  *
  * @see http://purl.org/puninj/2001/05/rgml-schema#
  */
class RgmlServiceImpl(implicit val inj: Injector) extends RgmlService with Injectable with EvaluationToSparqlEndpoint {
  var sparqlEndpointService = inject[SparqlEndpointService]

  /** Get a graph resource (resource of type rgml:Graph).
    *
    * If there are multiple resources of this type available, return an arbitrary one. For this
    * reason, only one graph should exist in the data set.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    */
  override def graph(evaluation: PipelineEvaluation)(implicit session: Session): Option[Graph] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new GraphQuery(),
      new GraphExtractor())
  }

  /** Get all edges (resources of type rgml:Edge).
    *
    * @param evaluation result of pipeline evaluation (= data set)
    */
  override def edges(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Edge]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new EdgesQuery(),
      new EdgesExtractor())
  }

  /** Get all nodes (resources of type rgml:Node).
    *
    * @param evaluation result of pipeline evaluation (= data set)
    */
  override def nodes(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Node]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new NodesQuery(),
      new NodesExtractor())
  }

  /** Get all nodes (resources of type rgml:Node), paginated.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    * @param offset starting node (zero-based)
    * @param limit size of a page (how many nodes should be returned)
    */
  override def nodes(evaluation: PipelineEvaluation, offset: Integer, limit: Integer)(implicit session: Session): Option[Seq[Node]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new NodesQuery(Some(offset), Some(limit)),
      new NodesExtractor())
  }

  /** Get nodes (resources of type rgml:Node) identified by given URIs.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    * @param uris list of node URIs that should be returned.
    */
  override def nodes(evaluation: PipelineEvaluation, uris: Seq[String])(implicit session: Session): Option[Seq[Node]] = {
    // To make this more scalable, we specifically fetch only those nodes that we need (instead
    // of fetching all nodes, which would fail for large graphs) and we do it in "batches". The
    // value batchSize defines how many nodes are fetched within a single batch. It's basically an
    // arbitrary value which shouldn't be too small (too many requests resulting in decreased speed)
    // or too big (we might reach the query length limit).
    val batchSize = 100
    val endpoint = evaluationToSparqlEndpoint(evaluation)

    Some(uris.sliding(batchSize, batchSize).flatMap(batch => {
      sparqlEndpointService.getResult(
        endpoint,
        new NodesByUrisQuery(batch),
        new NodesExtractor())
    }).flatten.toSeq)
  }

  /** Get all nodes (resources of type rgml:Node) with calculated outgoing and incoming degrees.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    */
  override def nodesWithDegree(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[NodeWithDegree]] = {
    graph(evaluation) flatMap { graph =>
      sparqlEndpointService.getResult(
        evaluationToSparqlEndpoint(evaluation),
        new NodesWithDegreeQuery(),
        new NodesWithDegreeExtractor(graph))
    }
  }

  /** Calculate adjacency matrix for selected nodes.
    *
    * An adjacency matrix is a square matrix when the (i,j) value corresponds to number of edges
    * between nodes i and j. Typically this value is either 1 (nodes are connected) or 0
    * (nodes are not connected). It might happen that there are multiple edges between two nodes
    * (multi graphs) in which case the value will be higher.
    *
    * This behavior can be slightly altered with the {@code useWeights} parameter. If this
    * parameter is true, then an edge is counted as its weight value instead of just 1. For
    * example, an edge with weight 10 is "worth" 10 edges with weight 1. They both show up
    * as tens in the adjacency matrix.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    * @param nodeUris list of node URIs for which the adjacency should be calculated.
    * @param useWeights if true, an edge is counted as its weight value instead of just 1.
    */
  def matrix(evaluation: PipelineEvaluation, nodeUris: Seq[String], useWeights: Boolean = true)(implicit session: Session): Option[Seq[Seq[Double]]] = {
    if (nodeUris.isEmpty) return Some(Seq(Seq()))

    for {
      graph <- graph(evaluation)
      edges <- Some(nodeUris
        // Let's fetch incident edges for all required nodes. Some edges might be selected
        // multiple times and some edges we don't need at all but we're still making only O(n)
        // SPARQL requests. This approach works also for very large graphs.
        .flatMap(uri => incidentEdges(evaluation, uri))
        .reduceLeft((result, edges) => result ++ edges).toSet)
    } yield {
      val urisSet = nodeUris.toSet

      // Adjacency matrix of the graph.
      val matrix: mutable.Map[String, mutable.Map[String, Double]] = mutable.Map()

      // Update the adjacency matrix using an edge going from source to target.
      def addEdge(source: String, target: String, weight: Double) {
        val counts = matrix.getOrElse(source, mutable.Map())
        counts.put(target, counts.getOrElse(target, 0.0) + (if (useWeights) weight else 1))
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
      nodeUris.map(source =>
        nodeUris.map(target =>
          matrix.getOrElse(source, mutable.Map()).getOrElse(target, 0.0)
        )
      )
    }
  }

  /** Get all edges (resource of type rgml:Edge) incident to given node (resource of type rgml:Node).
    *
    * An edge is considered incident if it starts or ends in the given node. Using
    * the {@code direction} parameter it can be specified whether only outgoing or only incoming
    * edges should be returned. If the parameter is not specified, both outgoing and incoming edges
    * are returned. Also note that if the graph is undirected, all edges are returned regardless
    * of specified direction.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    * @param nodeUri node we want incident edges of.
    * @param direction if defined, we return edges only of given direction.
    */
  override def incidentEdges(evaluation: PipelineEvaluation, nodeUri: String, direction: Option[EdgeDirection] = None)(implicit session: Session): Option[Seq[Edge]] = {
    // Fetch edges in one direction
    def fetchEdges(actualDirection: EdgeDirection) = {
      sparqlEndpointService.getResult(
        evaluationToSparqlEndpoint(evaluation),
        new IncidentEdgesQuery(nodeUri, actualDirection),
        new EdgesExtractor)
    }

    // Fetch edges in both directions (it turns out that two queries are faster than one with UNION)
    def fetchAllEdges() = {
      for {
        incoming <- fetchEdges(Incoming)
        outgoing <- fetchEdges(Outgoing)
      } yield incoming ++ outgoing
    }

    direction match {
      case Some(d) => graph(evaluation) flatMap { graph =>
        if (!graph.directed)
          fetchAllEdges()
        else
          fetchEdges(d)
      }
      case None => fetchAllEdges()
    }
  }

  /** Get all nodes (resource of type rgml:Node) adjacent to given node.
    *
    * Two nodes are considered adjacent if they are connected by an edge. Using the
    * {@code direction} parameter it can be specified whether only nodes connected by outgoing
    * (or incoming) edges should be returned. If the parameter is not specified, all adjacent
    * nodes are returned. Also note that if the graph is undirected, all nodes are returned
    * regardless of specified direction.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    * @param nodeUri node we want adjacent nodes of.
    * @param direction if defined, we return only those nodes connected by edges of given direction.
    */
  override def adjacentNodes(evaluation: PipelineEvaluation, nodeUri: String, direction: Option[EdgeDirection] = None)(implicit session: Session): Option[Seq[Node]] = {
    // Fetch nodes in one direction
    def fetchNodes(actualDirection: EdgeDirection) = {
      sparqlEndpointService.getResult(
        evaluationToSparqlEndpoint(evaluation),
        new AdjacentNodesQuery(nodeUri, actualDirection),
        new NodesExtractor)
    }

    // Fetch nodes in both directions (it turns out that two queries are faster than one with UNION)
    def fetchAllNodes() = {
      for {
        incoming <- fetchNodes(Incoming)
        outgoing <- fetchNodes(Outgoing)
      } yield incoming ++ outgoing
    }

    direction match {
      case Some(d) => graph(evaluation) flatMap { graph =>
        if (!graph.directed)
          fetchAllNodes()
        else
          fetchNodes(d)
      }
      case None => fetchAllNodes()
    }
  }

  /** Get graph sample based on nodes' outgoing degrees.
    *
    * A graph sample is a subgraph of the original graph, in our case induced by nodes (that
    * means that we simply return a subset of the original graph's nodes).
    *
    * This method is very simple. We fetch all nodes including their degrees, we sort them by
    * outgoing degree and eventually take first n nodes with highest degrees, where n is the
    * desired sample size. This method is very fast for small graphs but it might fail for very
    * large graphs. Moreover, generated sample usually doesn't share any characteristics with the
    * original graph.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    * @param size of the sample
    */
  override def sampleNodesByHighestDegree(evaluation: PipelineEvaluation, size: Int)(implicit session: Session): Option[Seq[Node]] = {
    // Get 'size' nodes with the highest out degree and lets hope there will be something to visualize
    Some(nodesWithDegree(evaluation).getOrElse(Seq.empty).sortBy(-_.outDegree)
      .take(size).map(node => Node(node.uri, node.label)))
  }

  /** Get graph sample generated using Forest Fire algorithm.
    *
    * A graph sample is a subgraph of the original graph, in our case induced by nodes (that
    * means that we simply return a subset of the original graph's nodes).
    *
    * This sampling method is an enhanced version of Breadth-first search. We start the "fire"
    * from a randomly chosen node and then spread it over its incident edges to its surroundings.
    * The key difference compared to standard BFS is that when traversing over an edge, we "flip
    * a coin" with certain probability ({@code pF} for outgoing edges, {@code pB} for incoming
    * edges) to determine whether the "fire" should "spread" over this edge to the other node and
    * "burn" it.
    *
    * The behavior can be slightly altered with the {@code useWeights} parameter. If this parameter
    * is true, we take edge weights into account when "flipping the coin". For example, if an edge
    * has weight equal to 2, we count it as two edges, therefore we "flip the coin" twice giving
    * the "fire" an increased chance to spread over this edge.
    *
    * @param evaluation result of pipeline evaluation (= data set)
    * @param size of the sample
    * @param useWeights take edge weights into account
    * @param pF probability that the "fire" will spread over an outgoing edge
    * @param pB probability that the "fire" will spread over an incoming edge
    */
  override def sampleNodesWithForestFire(
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

    /** Run the actual Forest Fire algorithm to generate the sample. */
    def makeSample: Seq[String] = {
      var sample = Set.empty[String]
      while (sample.size < Math.min(size, g.nodeCount)) {
        // Pick a random node and run BFS from it. If the fire "dies out" before burning
        // enough nodes for our sample, pick another node and run BFS again.
        val v = randomNode.uri
        if (!sample.contains(v))
          sample = burn(sample + v, Seq(v))
      }

      sample.toSeq
    }

    /**
      * Pick a random node. As the SPARQL support for randomness varies across different engines,
      * we decided to use a more reliable solution. We generate a random OFFSET between 0 and
      * graph node count. We return the node at this offset.
      */
    def randomNode: Node = nodes(evaluation, random.nextInt(g.nodeCount), 1).get.head

    /**
      * This is the core BFS recursive function that spreads the "fire" from the current
      * {@code frontier} to the adjacent (unburnt) nodes, creating a new frontier which is
      * added to the {@code sample}. The function is then recursively called on the new frontier.
      *
      * @param sample set of nodes we have collected so far
      * @param frontier nodes at the "frontier" of the fire from where it spreads to the graph
      * @return sample with all discovered "burnt" nodes.
      */
    def burn(sample: Set[String], frontier: Seq[String]): Set[String] = {
      // As traversing through the graph using SPARQL queries is rather expensive, we need to
      // avoid unnecessary queries and stop the algorithm as soon as we have enough nodes.
      if (sample.size >= size)
        return sample

      // Iterate over all burning nodes at the frontier and spread fire from each node to its
      // adjacent nodes. We have to make sure to avoid burning the same node twice.
      val nextFrontier = frontier
        .flatMap(spread)
        .filterNot(sample.contains)
        .distinct
        .take(size - sample.size) // To make sure that we don't collect more nodes than we need.

      if (nextFrontier.isEmpty)
        sample
      else
        burn(sample ++ nextFrontier, nextFrontier)
    }

    /**
      * Return those adjacent nodes of {@code node} that "caught on fire", i. e. the nodes
      * that should "burn" and become part of the next frontier. In standard BFS implementation,
      * this would simply return all adjacent nodes.
      */
    def spread(node: String): Seq[String] = {
      incidentEdges(evaluation, node).getOrElse(Seq())
        .filter(edge => choose(edge, probability(node, edge)))
        .map(edge => theOther(node, edge))
    }

    /** "Flip a coin" with probability {@code p} and return whether {@code edge} should burn */
    def choose(edge: Edge, p: Double): Boolean = {
      // When weights are enabled, we're simulating multiple coin tosses for a single edge. One
      // "heads" is enough to get the edge burnt. To determine such probability, we use the
      // standard school trick. The probability is determined as "1 - (1 - p)^n" where {@code p}
      // is the probability of "heads" and n is number of tosses (1 or {@code useWeights} when
      // weights are enabled).
      random.nextFloat() < 1 - Math.pow(1 - p, if (useWeights) edge.weight else 1)
    }

    /** Determine the probability of whether {@code edge} (relatively to {@code node}) will burn */
    def probability(node: String, edge: Edge): Double = {
      if (direction(node, edge) == Outgoing || !g.directed) pF else pB
    }

    /** Return "the other" node of {@code edge) relatively {@code node} */
    def theOther(node: String, edge: Edge): String = {
      if (direction(node, edge) == Outgoing) edge.target else edge.source
    }

    /** Determine direction of {@code edge} relatively to {@code node} */
    def direction(node: String, edge: Edge): EdgeDirection = {
      if (edge.source == node) Outgoing else Incoming
    }

    // As the sample consists of just node URIs, we fetch the actual resources (with labels)
    nodes(evaluation, makeSample)
  }
}
