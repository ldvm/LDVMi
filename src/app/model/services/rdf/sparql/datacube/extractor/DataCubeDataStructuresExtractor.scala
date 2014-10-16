package model.services.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import com.hp.hpl.jena.vocabulary.RDF
import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.datacube._
import model.services.rdf.sparql.datacube.query.DataCubeDataStructuresQuery
import model.services.rdf.sparql.extractor.{ExtractorHelpers, SparqlResultExtractor}
import model.services.rdf.sparql.jena.JenaLangRdfXml
import model.services.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import model.services.rdf.vocabulary.QB

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
