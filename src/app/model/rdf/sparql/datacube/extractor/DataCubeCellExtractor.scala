package model.rdf.sparql.datacube.extractor

import model.rdf.sparql.datacube.query.DataCubeCellQuery
import model.rdf.sparql.datacube.{DataCubeCell, DataCubeKey}
import model.rdf.extractor.SparqlResultExtractor
import model.rdf.sparql.jena.QueryExecutionTypeConstruct

class DataCubeCellExtractor(k: DataCubeKey) extends SparqlResultExtractor[DataCubeCellQuery, QueryExecutionTypeConstruct, DataCubeCell] {
  /*
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

  override def getLang: JenaLangTtl = transformer.getLang*/
  override def extract(execution: QueryExecutionTypeConstruct): Option[DataCubeCell] = None
}