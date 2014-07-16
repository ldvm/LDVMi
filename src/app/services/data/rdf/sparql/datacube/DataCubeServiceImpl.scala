package services.data.rdf.sparql.datacube

import com.hp.hpl.jena.query.Dataset
import data.models.DataSource
import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.query.SparqlQuery
import services.data.rdf.sparql.{SparqlEndpointService, GenericSparqlEndpoint}
import services.data.rdf.sparql.datacube.extractor.{DataCubeDataStructuresExtractor, DataCubeDatasetsExtractor}
import services.data.rdf.sparql.datacube.query.{DataCubeDataStructuresQuery, DataCubeDatasetsQuery}

class DataCubeServiceImpl(implicit val inj: Injector) extends DataCubeService with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset] = {
    sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeDatasetsQuery, new DataCubeDatasetsExtractor)
  }

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure] = {
    println(dataSource)
    sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeDataStructuresQuery, new DataCubeDataStructuresExtractor)
  }

  private def get(dataSource: DataSource, query: SparqlQuery): Dataset = {
    val endpoint = GenericSparqlEndpoint(dataSource)
    sparqlEndpointService.query(endpoint, query)
  }
}