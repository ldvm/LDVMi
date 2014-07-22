package services.data.rdf.sparql.transformer

import com.hp.hpl.jena.query.Dataset
import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.jena.JenaLangRdfXml

class RdfXmlJenaModelTransformer extends JenaDatasetTransformer[JenaLangRdfXml] {

  override def transform(data: SparqlResult[JenaLangRdfXml]): Dataset = {
    super.transform(data)
  }

  override def getLang: JenaLangRdfXml = new JenaLangRdfXml
}
