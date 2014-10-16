package model.services.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.datacube.query.DataCubeCellQuery
import model.services.rdf.sparql.datacube.{DataCubeCell, DataCubeKey}
import model.services.rdf.sparql.extractor.SparqlResultExtractor
import model.services.rdf.sparql.jena.JenaLangTtl
import model.services.rdf.sparql.transformer.TtlJenaModelTransformer

import scala.collection.JavaConversions._

class DataCubeCellExtractor(k: DataCubeKey) extends SparqlResultExtractor[DataCubeCellQuery, JenaLangTtl, DataCubeCell] {

  lazy val model = ModelFactory.createDefaultModel()
  val transformer = new TtlJenaModelTransformer

  def extract(data: SparqlResult[JenaLangTtl]): DataCubeCell = {
    val dataset = transformer.transform(data)
    val values = k.measureUris.map { uri =>
      val measureProperty = dataset.getDefaultModel.getProperty(uri)
      val measureNodes = dataset.getDefaultModel.listObjectsOfProperty(measureProperty)
      uri -> measureNodes.collectFirst {
        case o if o.isLiteral => o.asLiteral().getFloat
      }
    }
    new DataCubeCell(k, values.toMap)
  }

  override def getLang: JenaLangTtl = transformer.getLang
}
