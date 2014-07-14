package services.data.rdf.sparql

import services.data.rdf.sparql.jena.JenaLang

class SparqlResult[D <: JenaLang](data: String) {

  def stringValue : String = data

}
