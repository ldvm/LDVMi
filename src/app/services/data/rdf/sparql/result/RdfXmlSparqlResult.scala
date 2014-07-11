package services.data.rdf.sparql.result

import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.jena.JenaLangRdfXml

class RdfXmlSparqlResult(result: String) extends SparqlResult[JenaLangRdfXml] {
  def stringValue: String = result
}
