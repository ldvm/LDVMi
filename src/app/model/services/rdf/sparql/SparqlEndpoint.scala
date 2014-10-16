package model.services.rdf.sparql

import jena.JenaLang
import query.SparqlQuery

trait SparqlEndpoint {
  def executeQuery[D <: JenaLang](query: SparqlQuery, lang: D): Option[SparqlResult[D]]
}
