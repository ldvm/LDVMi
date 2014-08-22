package services.data.rdf.sparql.extractor

import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.jena.SparqlResultLang
import services.data.rdf.sparql.query.SparqlQuery

trait SparqlResultExtractor[Q <: SparqlQuery, D <: SparqlResultLang, R] extends ResultExtractor[Q, SparqlResult[D], R] {

  def extract(data: SparqlResult[D]): R

  def getLang: D

}
