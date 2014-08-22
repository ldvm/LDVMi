package services.data.rdf.sparql

import services.data.rdf.sparql.jena.SparqlResultLang

class SparqlResult[D <: SparqlResultLang](data: String) {

  def stringValue : String = data

}
