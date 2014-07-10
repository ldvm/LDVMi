package services.data.rdf.sparql

import services.data.rdf.sparql.jena.JenaLang

trait SparqlResultTransformer[D <: JenaLang, R] {

  def transform(data: SparqlResult[D]) : R

}
