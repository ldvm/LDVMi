package services.data.rdf.sparql.jena

import org.apache.jena.riot.Lang

trait JenaLang {
  def get: Lang
  def acceptType: String
}
