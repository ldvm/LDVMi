package services.data.rdf.sparql.datacube

import com.hp.hpl.jena.query.Dataset
import data.models.DataSource
import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.{SparqlResultExtractor, SparqlQuery, SparqlEndpointService, GenericSparqlEndpoint}
import services.data.rdf.sparql.datacube.extractor.{DataCubeDataStructuresExtractor, DataCubeDatasetsExtractor}
import services.data.rdf.sparql.datacube.query.{DataCubeDataStructuresQuery, DataCubeDatasetsQuery}

class DataCubeServiceImpl(implicit val inj: Injector) extends DataCubeService with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset] = {
    sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeDatasetsQuery, new DataCubeDatasetsExtractor)
  }

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure] = {
    sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeDataStructuresQuery, new DataCubeDataStructuresExtractor)
  }

  private def _get(dataSource: DataSource, query: SparqlQuery): Dataset = {
    val endpoint = GenericSparqlEndpoint(dataSource)
    sparqlEndpointService.query(endpoint, query)
  }
}