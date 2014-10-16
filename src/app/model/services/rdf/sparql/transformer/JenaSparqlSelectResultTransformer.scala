package model.services.rdf.sparql.transformer

import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.jena.{SelectLang, JenaLangRdfXml}
import model.services.rdf.sparql.model.SparqlResultSet

class JenaSparqlSelectResultTransformer extends SparqlResultTransformer[SelectLang, Seq[SparqlResultSet]] {

  override def transform(data: SparqlResult[SelectLang]): Seq[SparqlResultSet] = {
    List()
  }

  override def getLang: SelectLang = new SelectLang
}
