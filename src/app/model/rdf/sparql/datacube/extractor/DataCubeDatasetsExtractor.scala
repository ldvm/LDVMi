package model.rdf.sparql.datacube.extractor

import model.rdf.sparql.datacube.DataCubeDataset
import model.rdf.sparql.datacube.query.DataCubeDatasetsQuery
import model.rdf.extractor.ConstructResultExtractor
import model.rdf.sparql.jena.QueryExecutionTypeConstruct

class DataCubeDatasetsExtractor extends ConstructResultExtractor[DataCubeDatasetsQuery, Seq[DataCubeDataset]] {
  /*
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
    }*/
  override def extract(execution: QueryExecutionTypeConstruct): Option[Seq[DataCubeDataset]] = None
}
