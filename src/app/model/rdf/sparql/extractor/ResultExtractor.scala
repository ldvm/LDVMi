package model.rdf.sparql.extractor

import model.rdf.sparql.query.SparqlQuery

trait ResultExtractor[Q <: SparqlQuery, InputType, R] {

  def extract(execution: InputType): Option[R]

}
