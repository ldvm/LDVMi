package model.services.rdf.sparql.transformer

import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.jena.{SparqlResultLang, JenaLang}

trait SparqlResultTransformer[D <: SparqlResultLang, R] {

  def transform(data: SparqlResult[D]) : R

  def getLang: D

}
