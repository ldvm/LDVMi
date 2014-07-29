package services.data.rdf.sparql.datacube

import com.hp.hpl.jena.query.Dataset
import data.models._
import scaldi.{Injectable, Injector}
import services.MD5
import services.data.rdf.sparql.query.SparqlQuery
import services.data.rdf.sparql.{SparqlEndpointService, GenericSparqlEndpoint}
import services.data.rdf.sparql.datacube.extractor.{DataCubeValuesExtractor, DataCubeDataStructuresExtractor, DataCubeDatasetsExtractor}
import services.data.rdf.sparql.datacube.query.{DataCubeValuesQuery, DataCubeDataStructuresQuery, DataCubeDatasetsQuery}

import scala.collection.parallel
import scala.slick.lifted.TableQuery
import play.api.db.slick._
import play.api.db.slick.Config.driver.simple._
import play.api.libs.json.JsValue

class DataCubeServiceImpl(implicit val inj: Injector) extends DataCubeService with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]

  def getDatasets(dataSource: DataSource): Seq[DataCubeDataset] = {
    sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeDatasetsQuery, new DataCubeDatasetsExtractor)
  }

  def getDataStructures(dataSource: DataSource): Seq[DataCubeDataStructure] = {
    sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeDataStructuresQuery, new DataCubeDataStructuresExtractor)
  }

  def getValues(dataSource: DataSource, uris: List[String]): Map[String, Seq[DataCubeComponentValue]] = {
    uris.par.map { uri =>
      uri -> sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeValuesQuery(uri), new DataCubeValuesExtractor)
    }.toList.toMap
  }

  def queryCube(dataSource: DataSource, queryData: DataCubeQueryData): Option[DataCube] = {
    val slices = Map("x" -> Map(CubeKey("a", "b") -> Map(CubeKey("c") -> 2)))
    Some(DataCube(2,1,slices))
  }

  def processCubeQuery(v: Visualization, dataSource: DataSource, queryData: DataCubeQueryData, jsonQueryData: JsValue)
                      (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult = {
    val token = MD5.hash(queryData.toString)

    val queries = TableQuery[VisualizationQueries]
    queries.filter(_.token === token).delete
    queries += VisualizationQuery(0, v.id, token, jsonQueryData.toString)

    val cube = queryCube(dataSource, queryData)
    new DataCubeQueryResult(token, cube)
  }

  private def get(dataSource: DataSource, query: SparqlQuery): Dataset = {
    val endpoint = GenericSparqlEndpoint(dataSource)
    sparqlEndpointService.query(endpoint, query)
  }
}