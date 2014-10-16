package model.services.rdf.sparql.jena

import org.apache.jena.riot.Lang

trait JenaLang extends SparqlResultLang {
  def get: Lang
}
