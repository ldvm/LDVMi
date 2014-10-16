package model.services.rdf.sparql.transformer

import com.hp.hpl.jena.query.Dataset
import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.jena.JenaLangRdfXml

class RdfXmlJenaModelTransformer extends JenaDatasetTransformer[JenaLangRdfXml] {

  override def transform(data: SparqlResult[JenaLangRdfXml]): Dataset = {
    super.transform(data)
  }

  override def getLang: JenaLangRdfXml = new JenaLangRdfXml
}
