package model.services.rdf.sparql

import _root_.model.services.rdf.sparql.jena.SparqlResultLang

class SparqlResult[D <: SparqlResultLang](data: String) {

  def stringValue : String = data

}
