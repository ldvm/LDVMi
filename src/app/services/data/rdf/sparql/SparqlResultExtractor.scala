package services.data.rdf.sparql

import services.data.rdf.sparql.jena.JenaLang

trait SparqlResultExtractor[Q <: SparqlQuery, D <: JenaLang, R] {

  def extract(data: SparqlResult[D]) : R

}
