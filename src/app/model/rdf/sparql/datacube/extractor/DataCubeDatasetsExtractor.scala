package model.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.sparql.datacube.DataCubeDataset
import model.rdf.sparql.datacube.query.DataCubeDatasetsQuery
import model.rdf.extractor.{ExtractorHelpers, QueryExecutionResultExtractor, ConstructResultExtractor}
import model.rdf.vocabulary.QB
import scala.collection.JavaConversions._

class DataCubeDatasetsExtractor extends QueryExecutionResultExtractor[DataCubeDatasetsQuery, Seq[DataCubeDataset]] {

  def extract(input: QueryExecution): Option[Seq[DataCubeDataset]] = {
    val model = input.execConstruct()

    val dataSetResources = model.listResourcesWithProperty(RDF.`type`, QB.dataset).toList
    Some(dataSetResources.map{ datasetResource =>

      val descriptions = ExtractorHelpers.extractDescriptions(datasetResource)

      new DataCubeDataset(
        datasetResource.getURI,
        title = descriptions.DCT_title,
        description = descriptions.DCT_description,
        label = descriptions.RDFS_label,
        comment = descriptions.RDFS_comment
        //prefLabel = descriptions.SKOS_prefLabel
      )
    })
  }
}
