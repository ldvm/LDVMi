package services.data.rdf.sparql.datacube

import data.models.DataSource
import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.datacube.query.DatasetsDataCubeQuery
import services.data.rdf.sparql.{SparqlEndpointService, GenericSparqlEndpoint}

class DataCubeServiceImpl(implicit val inj: Injector) extends DataCubeService with Injectable {

  var sparqlEndpointService = inject [SparqlEndpointService]

  def getDatasets(dataSource: DataSource) : Seq[DataCubeDataset] = {

    val endpoint = GenericSparqlEndpoint(dataSource)
    sparqlEndpointService.query(endpoint, new DatasetsDataCubeQuery)

    List(new DataCubeDataset("a"))

  }
}