package services.data.rdf.sparql.datacube

import com.hp.hpl.jena.query.Dataset
import data.models.DataSource
import scaldi.{Injectable, Injector}
import services.data.rdf.sparql.query.SparqlQuery
import services.data.rdf.sparql.{SparqlEndpointService, GenericSparqlEndpoint}
import services.data.rdf.sparql.datacube.extractor.{DataCubeValuesExtractor, DataCubeDataStructuresExtractor, DataCubeDatasetsExtractor}
import services.data.rdf.sparql.datacube.query.{DataCubeValuesQuery, DataCubeDataStructuresQuery, DataCubeDatasetsQuery}

import scala.collection.parallel

class DataCubeServiceImpl(implicit val inj: Injector) extends DataCubeService with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset] = {
    sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeDatasetsQuery, new DataCubeDatasetsExtractor)
  }

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure] = {
    sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeDataStructuresQuery, new DataCubeDataStructuresExtractor)
  }

  def getValues(dataSource: DataSource, uris: List[String]): Map[String, Seq[DataCubeComponentValue]] = {
    uris.par.map{ uri =>
      uri -> sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeValuesQuery(uri), new DataCubeValuesExtractor)
    }.toList.toMap
  }

  def queryCube(dataSource: DataSource) : String = {
    ""
  }

  private def get(dataSource: DataSource, query: SparqlQuery): Dataset = {
    val endpoint = GenericSparqlEndpoint(dataSource)
    sparqlEndpointService.query(endpoint, query)
  }
}