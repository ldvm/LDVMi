package model.rdf.sparql.datacube.extractor

import model.rdf.extractor.{ExtractorHelpers, QueryExecutionResultExtractor}
import model.rdf.sparql.datacube._
import model.rdf.sparql.datacube.query.DataCubeDataStructuresQuery
import model.rdf.vocabulary.QB
import org.apache.jena.query.QueryExecution
import org.apache.jena.vocabulary.RDF

import scala.collection.JavaConversions._

class DataCubeDataStructuresExtractor extends QueryExecutionResultExtractor[DataCubeDataStructuresQuery, Seq[DataCubeDataStructure]] {

  override def extract(input: QueryExecution): Option[Seq[DataCubeDataStructure]] = {
    val dsds = input.execConstruct().listSubjectsWithProperty(RDF.`type`, QB.dataStructureDefinition).toList

    Some(dsds.map { resource =>

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
    })
  }
}
