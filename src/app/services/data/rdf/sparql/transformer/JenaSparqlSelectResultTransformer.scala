package services.data.rdf.sparql.transformer

import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.jena.{SelectLang, JenaLangRdfXml}
import services.data.rdf.sparql.model.SparqlResultSet

class JenaSparqlSelectResultTransformer extends SparqlResultTransformer[SelectLang, Seq[SparqlResultSet]] {

  override def transform(data: SparqlResult[SelectLang]): Seq[SparqlResultSet] = {
    List()
  }

  override def getLang: SelectLang = new SelectLang
}
