package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import com.hp.hpl.jena.vocabulary.RDF
import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.datacube.DataCubeDataset
import services.data.rdf.sparql.datacube.query.DataCubeDatasetsQuery
import services.data.rdf.sparql.extractor.{ExtractorHelpers, SparqlResultExtractor}
import services.data.rdf.sparql.jena.JenaLangRdfXml
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import services.data.rdf.vocabulary.QB
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
