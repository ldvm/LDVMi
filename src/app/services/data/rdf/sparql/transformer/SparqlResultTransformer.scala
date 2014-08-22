package services.data.rdf.sparql.transformer

import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.jena.{SparqlResultLang, JenaLang}

trait SparqlResultTransformer[D <: SparqlResultLang, R] {

  def transform(data: SparqlResult[D]) : R

  def getLang: D

}
