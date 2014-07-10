package services.data.rdf.sparql.transformer

import com.hp.hpl.jena.query.Dataset
import services.data.rdf.sparql.{SparqlResult, SparqlResultTransformer}
import services.data.rdf.sparql.jena.JenaLangRdfXml

class RdfXmlJenaModelTransformer extends SparqlResultTransformer[JenaLangRdfXml, Dataset] {
  def transform(data: SparqlResult[JenaLangRdfXml]): Dataset = {
    null
  }
}
