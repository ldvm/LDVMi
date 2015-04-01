package model.rdf.sparql.jena

import org.apache.jena.riot.Lang

trait JenaLang extends QueryExecutionType {
  def get: Lang
}
