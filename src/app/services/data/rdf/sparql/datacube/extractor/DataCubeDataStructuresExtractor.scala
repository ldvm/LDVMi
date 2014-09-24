package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import com.hp.hpl.jena.vocabulary.RDF
import services.data.rdf.sparql.SparqlResult
import services.data.rdf.sparql.datacube._
import services.data.rdf.sparql.datacube.query.DataCubeDataStructuresQuery
import services.data.rdf.sparql.extractor.{ExtractorHelpers, SparqlResultExtractor}
import services.data.rdf.sparql.jena.JenaLangRdfXml
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import services.data.rdf.vocabulary.QB

import scala.collection.JavaConversions._

class DataCubeDataStructuresExtractor extends SparqlResultExtractor[DataCubeDataStructuresQuery, JenaLangRdfXml, Seq[DataCubeDataStructure]] {

  val transformer = new RdfXmlJenaModelTransformer

  private lazy val model = ModelFactory.createDefaultModel

  def extract(data: SparqlResult[JenaLangRdfXml]): Seq[DataCubeDataStructure] = {
    val dataset = transformer.transform(data)
    val iterator = dataset.getDefaultModel.listSubjectsWithProperty(RDF.`type`, model.createResource(QB.dataStructureDefinition.getURI))

    iterator.toList.map { resource =>

      val descriptions = ExtractorHelpers.extractDescriptions(resource)
      new DataCubeDataStructure(
        resource.getURI,
        List(),
        descriptions.DCT_title,
        descriptions.RDFS_label,
        descriptions.RDFS_comment,
        descriptions.DCT_description,
        descriptions.SKOS_prefLabel
      )
    }
  }

  override def getLang: JenaLangRdfXml = transformer.getLang

}
