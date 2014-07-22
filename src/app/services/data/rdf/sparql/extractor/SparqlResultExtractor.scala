package services.data.rdf.sparql.extractor

import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.jena.JenaLang
import services.data.rdf.sparql.query.SparqlQuery

trait SparqlResultExtractor[Q <: SparqlQuery, D <: JenaLang, R] {

  def extract(data: SparqlResult[D]) : R

  def getLang: D

}
