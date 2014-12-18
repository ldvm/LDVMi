package model.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.sparql.datacube._
import model.rdf.sparql.datacube.query.DataCubeDataStructuresQuery
import model.rdf.extractor.{ConstructResultExtractor, ExtractorHelpers, SparqlResultExtractor}
import model.rdf.sparql.jena.QueryExecutionTypeConstruct
import model.rdf.vocabulary.QB

class DataCubeDataStructuresExtractor extends ConstructResultExtractor[DataCubeDataStructuresQuery, Seq[DataCubeDataStructure]] {
/*
  private lazy val model = ModelFactory.createDefaultModel
  val transformer = new RdfXmlJenaModelTransformer

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

  override def getLang: JenaLangRdfXml = transformer.getLang*/
  override def extract(execution: QueryExecutionTypeConstruct): Option[Seq[DataCubeDataStructure]] = None
}
