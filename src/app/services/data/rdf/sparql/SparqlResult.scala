package services.data.rdf.sparql

import services.data.rdf.sparql.jena.JenaLang

trait SparqlResult[D <: JenaLang] {

  def stringValue : String

}
