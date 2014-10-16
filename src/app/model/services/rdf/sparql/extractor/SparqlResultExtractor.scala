package model.services.rdf.sparql.extractor

import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.jena.SparqlResultLang
import model.services.rdf.sparql.query.SparqlQuery

trait SparqlResultExtractor[Q <: SparqlQuery, D <: SparqlResultLang, R] extends ResultExtractor[Q, SparqlResult[D], R] {

  def extract(data: SparqlResult[D]): R

  def getLang: D

}
