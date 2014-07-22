package services.data.rdf.sparql.transformer

import com.hp.hpl.jena.query.Dataset
import services.data.rdf.sparql.jena.JenaLangTtl
import services.data.rdf.sparql.SparqlResult

class TtlJenaModelTransformer extends JenaDatasetTransformer[JenaLangTtl] {

  override def transform(data: SparqlResult[JenaLangTtl]): Dataset = {
    super.transform(data)
  }

  override def getLang: JenaLangTtl = new JenaLangTtl
}
