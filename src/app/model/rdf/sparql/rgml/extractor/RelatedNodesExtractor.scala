package model.rdf.sparql.rgml.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.fresnel.Lens
import model.rdf.sparql.fresnel.query.LensesByPurposeQuery
import model.rdf.sparql.rgml.query.RelatedNodesQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class RelatedNodesExtractor extends QueryExecutionResultExtractor[RelatedNodesQuery, Seq[String]] {

  def extract(input: QueryExecution): Option[Seq[String]] = {
    val results = input.execSelect()
    val relatedNodes = results.map(querySolution =>
      querySolution.getResource("node").getURI
    )

    Some(relatedNodes.toSeq)
  }
}
