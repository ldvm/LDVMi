package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.datacube.query.DataCubeValuesQuery
import services.data.rdf.sparql.extractor.SparqlResultExtractor
import services.data.rdf.sparql.jena.JenaLangRdfXml
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer

class DataCubeValuesExtractor extends SparqlResultExtractor[DataCubeValuesQuery, JenaLangRdfXml, Seq[String]] {

  val transformer = new RdfXmlJenaModelTransformer
  lazy val model = ModelFactory.createDefaultModel()

  def extract(data: SparqlResult[JenaLangRdfXml]) : Seq[String] = {
    val dataset = transformer.transform(data)

    /*val iterator = dataset.getDefaultModel.listResourcesWithProperty(RDF.`type`, model.createResource(QB.dataset.getURI))
    iterator.toList.map{ datasetResource =>
      new DataCubeDataset("dsds")
    }*/
    List("ahoj")
  }
}
