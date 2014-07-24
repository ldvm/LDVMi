package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.datacube.DataCubeComponentValue
import services.data.rdf.sparql.datacube.query.DataCubeValuesQuery
import services.data.rdf.sparql.extractor.SparqlResultExtractor
import services.data.rdf.sparql.jena.{JenaLangTtl, JenaLangRdfXml}
import services.data.rdf.sparql.transformer.{JenaSparqlSelectResultTransformer, TtlJenaModelTransformer, RdfXmlJenaModelTransformer}

class DataCubeValuesExtractor extends SparqlResultExtractor[DataCubeValuesQuery, JenaLangTtl, Seq[DataCubeComponentValue]] {

  val transformer = new JenaSparqlSelectResultTransformer
  lazy val model = ModelFactory.createDefaultModel()

  def extract(data: SparqlResult[JenaLangTtl]) : Seq[DataCubeComponentValue] = {

    val results = transformer.transform(data)

    results.map(_.solutions.map{ s =>

      val labels = List(
        s.bindings.get(DataCubeValuesQuery.VALUE_PREFLABEL_VARIABLE),
        s.bindings.get(DataCubeValuesQuery.VALUE_LABEL_VARIABLE),
        s.bindings.get(DataCubeValuesQuery.VALUE_NOTION_VARIABLE)
      )

      val label = labels.find(_.isDefined).map(_.get.toString)

      new DataCubeComponentValue(label, s.bindings.get(DataCubeValuesQuery.VALUE_PROPERTY_VARIABLE).map(_.asInstanceOf[Map[String, Any]].get("uri").map(_.toString)).flatten)

    }).head // what if multiple results?
      .filter(v => v.label.isDefined || v.uri.isDefined)
      .sortBy(v => v.label.getOrElse(v.uri.get))
  }

  override def getLang: JenaLangTtl = transformer.getLang
}
