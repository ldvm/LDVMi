package model.rdf.sparql.fresnel.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.fresnel.Lens
import model.rdf.sparql.fresnel.query.LensesByPurposeQuery
import org.apache.jena.query.QueryExecution

import scala.collection.JavaConversions._

class LensesByPurposeExtractor extends QueryExecutionResultExtractor[LensesByPurposeQuery, Seq[Lens]] {

  def extract(input: QueryExecution): Option[Seq[Lens]] = {
    val results = input.execSelect()

    // Shown properties (fresnel:showProperties) for each lens are defined as a RDF collection which
    // is a bit hard to work with (it's complicated to re-CONSTRUCT such a collection). This
    // particular query returns one row for each property in the showProperties collection.
    // Therefore we need to perform simple aggregation to properly generate a sequence of lenses.

    val lenses = results.foldLeft[Map[String, Lens]](Map.empty)((lenses, querySolution) => {
      val uri = querySolution.getResource("uri").getURI
      val purpose = querySolution.get("purpose").toString
      val domain = querySolution.get("domain").toString
      val property = querySolution.getResource("showProperty").getURI

      val updated = lenses.get(uri) match {
        // TODO: Test whether the order in which the properties are selected from the triple store
        // is completely arbitrary (at this moment it seems that it's in reversed order)
        case Some(lens) => lens.copy(showProperties = List(property) ::: lens.showProperties)
        case None => new Lens(uri, purpose, domain, List(property))
      }

      lenses + (uri -> updated)
    })

    Some(lenses.values.toSeq)
  }
}
