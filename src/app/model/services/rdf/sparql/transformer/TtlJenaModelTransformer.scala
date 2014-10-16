package model.services.rdf.sparql.transformer

import com.hp.hpl.jena.query.Dataset
import model.services.rdf.sparql.jena.JenaLangTtl
import model.services.rdf.sparql.SparqlResult

class TtlJenaModelTransformer extends JenaDatasetTransformer[JenaLangTtl] {

  override def transform(data: SparqlResult[JenaLangTtl]): Dataset = {
    super.transform(data)
  }

  override def getLang: JenaLangTtl = new JenaLangTtl
}
