package model.services.rdf.sparql.extractor

import model.services.rdf.sparql.query.SparqlQuery

trait ResultExtractor[Q <: SparqlQuery, D, R] {

  def extract(data: D): R

}
