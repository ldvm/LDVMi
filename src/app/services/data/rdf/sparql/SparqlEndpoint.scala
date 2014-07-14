package services.data.rdf.sparql

import services.data.rdf.sparql.jena.JenaLang

trait SparqlEndpoint {
  def executeQuery[D <: JenaLang](query: SparqlQuery): Option[SparqlResult[D]]
}
