package services.data.rdf.sparql.geo.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.extractor.SparqlResultExtractor
import services.data.rdf.sparql.geo.query.PolygonEntitiesQuery
import services.data.rdf.sparql.geo.{Polygon, PolygonEntity}
import services.data.rdf.sparql.jena.JenaLangRdfXml
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import services.data.rdf.vocabulary.GeoSPARQL

import scala.collection.JavaConversions._

class PolygonEntitiesExtractor extends SparqlResultExtractor[PolygonEntitiesQuery, JenaLangRdfXml, Seq[PolygonEntity]] {

  val transformer = new RdfXmlJenaModelTransformer
  lazy val model = ModelFactory.createDefaultModel()

  def extract(data: SparqlResult[JenaLangRdfXml]) : Seq[PolygonEntity] = {
    val dataset = transformer.transform(data)
    val iterator = dataset.getDefaultModel.listObjectsOfProperty(GeoSPARQL.asWKT)

    iterator.map(n => PolygonEntity(None, Polygon(Seq()))).toSeq
  }

  def getLang: JenaLangRdfXml = transformer.getLang
}
