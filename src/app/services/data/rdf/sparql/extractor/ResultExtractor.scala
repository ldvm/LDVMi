package services.data.rdf.sparql.extractor

import services.data.rdf.sparql.query.SparqlQuery

trait ResultExtractor[Q <: SparqlQuery, D, R] {

  def extract(data: D): R

}
