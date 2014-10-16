package model.services.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import com.hp.hpl.jena.vocabulary.RDF
import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.datacube.DataCubeDataset
import model.services.rdf.sparql.datacube.query.DataCubeDatasetsQuery
import model.services.rdf.sparql.extractor.{ExtractorHelpers, SparqlResultExtractor}
import model.services.rdf.sparql.jena.JenaLangRdfXml
import model.services.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import model.services.rdf.vocabulary.QB
import scala.collection.JavaConversions._

class DataCubeDatasetsExtractor extends SparqlResultExtractor[DataCubeDatasetsQuery, JenaLangRdfXml, Seq[DataCubeDataset]] {

  val transformer = new RdfXmlJenaModelTransformer
  lazy val model = ModelFactory.createDefaultModel()

  def extract(data: SparqlResult[JenaLangRdfXml]) : Seq[DataCubeDataset] = {
    val dataset = transformer.transform(data)

    val iterator = dataset.getDefaultModel.listResourcesWithProperty(RDF.`type`, model.createResource(QB.dataset.getURI))
    iterator.toList.map{ datasetResource =>

      val descriptions = ExtractorHelpers.extractDescriptions(datasetResource)

      new DataCubeDataset(
        datasetResource.getURI,
        title = descriptions.DCT_title,
        description = descriptions.DCT_description,
        label = descriptions.RDFS_label,
        comment = descriptions.RDFS_comment
        //prefLabel = descriptions.SKOS_prefLabel
      )
    }
  }

  override def getLang: JenaLangRdfXml = transformer.getLang
}
