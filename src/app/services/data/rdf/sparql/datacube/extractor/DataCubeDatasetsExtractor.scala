package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.query.Dataset
import services.data.rdf.sparql.{SparqlResult, SparqlResultExtractor}
import services.data.rdf.sparql.datacube.DataCubeDataset
import services.data.rdf.sparql.datacube.query.DataCubeDatasetsQuery
import services.data.rdf.sparql.jena.JenaLangRdfXml
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer

class DataCubeDatasetsExtractor() extends SparqlResultExtractor[DataCubeDatasetsQuery, JenaLangRdfXml, Seq[DataCubeDataset]] {

  val transformer = new RdfXmlJenaModelTransformer

  def extract(data: SparqlResult[JenaLangRdfXml]) : Seq[DataCubeDataset] = {
    val dataset = dataToJenaDataset(data)

    List()
  }

  private def dataToJenaDataset(data: SparqlResult[JenaLangRdfXml]): Dataset = {
    transformer.transform(data)
  }
}
