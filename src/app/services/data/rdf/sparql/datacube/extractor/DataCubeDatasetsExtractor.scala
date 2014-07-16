package services.data.rdf.sparql.datacube.extractor

import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.datacube.DataCubeDataset
import services.data.rdf.sparql.datacube.query.DataCubeDatasetsQuery
import services.data.rdf.sparql.extractor.SparqlResultExtractor
import services.data.rdf.sparql.jena.JenaLangRdfXml
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer

class DataCubeDatasetsExtractor extends SparqlResultExtractor[DataCubeDatasetsQuery, JenaLangRdfXml, Seq[DataCubeDataset]] {

  val transformer = new RdfXmlJenaModelTransformer

  def extract(data: SparqlResult[JenaLangRdfXml]) : Seq[DataCubeDataset] = {
    val dataset = transformer.transform(data)

    List()
  }
}
