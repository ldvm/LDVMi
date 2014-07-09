package services.data.rdf.sparql.datacube

import com.hp.hpl.jena.query.Dataset
import data.models.DataSource
import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.SparqlQuery
import services.data.rdf.sparql.datacube.query.{DataCubeDataStructuresQuery, DataCubeDatasetsQuery}
import services.data.rdf.sparql.{SparqlEndpointService, GenericSparqlEndpoint}

class DataCubeServiceImpl(implicit val inj: Injector) extends DataCubeService with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset] = {
    _get(dataSource, new DataCubeDatasetsQuery)
    List(new DataCubeDataset("a"))
  }

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure] = {
    _get(dataSource, new DataCubeDataStructuresQuery)
    List(new DataCubeDataStructure("a"))
  }

  private def _get(dataSource: DataSource, query: SparqlQuery): Dataset = {
    val endpoint = GenericSparqlEndpoint(dataSource)
    sparqlEndpointService.query(endpoint, query)
  }
}