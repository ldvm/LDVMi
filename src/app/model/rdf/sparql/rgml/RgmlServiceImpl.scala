package model.rdf.sparql.rgml

import model.entity.PipelineEvaluation
import model.rdf.sparql.rgml.extractor.EdgesExtractor
import model.rdf.sparql.rgml.query.EdgesQuery
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

import scala.collection.mutable

class RgmlServiceImpl(implicit val inj: Injector) extends RgmlService with Injectable {
  var sparqlEndpointService = inject[SparqlEndpointService]

  override def edges(evaluation: PipelineEvaluation)(implicit session: Session): Option[Seq[Edge]] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new EdgesQuery(),
      new EdgesExtractor())
  }

  def matrix(evaluation: PipelineEvaluation)(implicit session: Session): Option[List[List[Int]]] = {
    edges(evaluation) match {
      case Some(edges) =>

        // Count number of edges between nodes. The edges are treated as undirected which means
        // that the result will be a symmetrical matrix indexed by node uris.

        val matrix: mutable.Map[String, mutable.Map[String, Int]] = mutable.Map()

        def updateCount(source: String, target: String) {
          val counts = matrix.getOrElse(source, mutable.Map())
          counts.put(target, counts.getOrElse(target, 0) + 1)
          matrix.put(source, counts)
        }

        edges.foreach(edge => {
          updateCount(edge.source, edge.target)

          if (edge.target != edge.source) {
            updateCount(edge.target, edge.source)
          }
        })

        // Let's remove the uris and create a pure matrix of integers (two-dimensional array/list).
        // We have to be careful to maintain the order.

        // Too many items, just for testing, let's print ministry of financies and its partners
        // (take the first 25 with highest counts)
        val mfcrUri = "http://linked.opendata.cz/resource/business-entity/CZ00006947"
        // val uris = mfcrUri :: matrix.get(mfcrUri).get.keys.toList
        val uris = mfcrUri :: matrix.get(mfcrUri).get.toList.sortBy(- _._2).map(_._1).take(25)
        Some(uris.map(source =>
          uris.map(target =>
            matrix.get(source).get.getOrElse(target, 0)
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
