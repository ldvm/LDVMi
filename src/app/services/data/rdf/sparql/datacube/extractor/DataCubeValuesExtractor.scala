package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.datacube.query.DataCubeValuesQuery
import services.data.rdf.sparql.extractor.SparqlResultExtractor
import services.data.rdf.sparql.jena.{JenaLangTtl, JenaLangRdfXml}
import services.data.rdf.sparql.transformer.{JenaSparqlSelectResultTransformer, TtlJenaModelTransformer, RdfXmlJenaModelTransformer}

class DataCubeValuesExtractor extends SparqlResultExtractor[DataCubeValuesQuery, JenaLangTtl, Seq[String]] {

  val transformer = new JenaSparqlSelectResultTransformer
  lazy val model = ModelFactory.createDefaultModel()

  def extract(data: SparqlResult[JenaLangTtl]) : Seq[String] = {

    val results = transformer.transform(data)

    results.map(_.solutions.map{ s =>

      s.bindings.getOrElse(DataCubeValuesQuery.VALUE_PREFLABEL_VARIABLE,
        s.bindings.getOrElse(DataCubeValuesQuery.VALUE_LABEL_VARIABLE,
          s.bindings.getOrElse(DataCubeValuesQuery.VALUE_NOTION_VARIABLE,
            s.bindings.getOrElse(DataCubeValuesQuery.VALUE_PROPERTY_VARIABLE,
              throw new Exception
            )
          )
        )
      ).toString

    }).head.sorted
  }

  override def getLang: JenaLangTtl = transformer.getLang
}
