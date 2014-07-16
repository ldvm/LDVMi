package services.data.rdf.sparql

import services.data.rdf.sparql.jena.JenaLang
import services.data.rdf.sparql.query.SparqlQuery

trait SparqlEndpoint {
  def executeQuery[D <: JenaLang](query: SparqlQuery): Option[SparqlResult[D]]
}
