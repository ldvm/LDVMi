package services.data.rdf.sparql.datacube
import data.models._
import scaldi.{Injectable, Injector}
import services.MD5
import services.data.rdf.sparql.SparqlEndpointService
import services.data.rdf.sparql.datacube.extractor.{DataCubeCellExtractor, DataCubeDataStructuresExtractor, DataCubeDatasetsExtractor, DataCubeValuesExtractor}
import services.data.rdf.sparql.datacube.query.{DataCubeCellQuery, DataCubeDataStructuresQuery, DataCubeDatasetsQuery, DataCubeValuesQuery}
import play.api.libs.json._
import play.api.db.slick.Config.driver.simple._

import scala.slick.lifted.TableQuery

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

  def sliceCubeAndPersist(v: Visualization, dataSource: DataSource, queryData: DataCubeQueryData, jsonQueryData: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult = {
    val token = MD5.hash(queryData.toString)

    val queries = TableQuery[VisualizationQueries]
    queries.filter(_.token === token).delete
    queries += VisualizationQuery(0, v.id, token, jsonQueryData.toString)

    new DataCubeQueryResult(token, sliceCube(dataSource, queryData))
  }

  private def sliceCube(dataSource: DataSource, queryData: DataCubeQueryData): Option[DataCube] = {

    def hasActiveValue(cf: DataCubeQueryComponentFilter): Boolean = cf.valuesSettings.exists(_.isActive.getOrElse(false))
    val allDimensionsHaveActiveValue = queryData.filters.componentFilters.filter(_.componentType == "dimension").forall(hasActiveValue)

    if (allDimensionsHaveActiveValue) {

      val cubeKeys = getCubeKeys(queryData)
      val cells = cubeKeys.par.map { k =>
        sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeCellQuery(ObservationPattern(k)), new DataCubeCellExtractor(k))
      }.toList

      //val slices = slice(cells, queryData)

      //Some(DataCube(cells, slices))
      None
    } else {
      None
    }
  }

  private def getCubeKeys(queryData: DataCubeQueryData): Seq[DataCubeKey] = {
    val measures = queryData.filters.componentFilters.filter(_.componentType == "measure").filter(_.isActive.getOrElse(false)).map(_.uri)

    val activeOnly = queryData.filters.componentFilters.map { cf =>
      cf.valuesSettings.filter(_.isActive.getOrElse(false)).map(cf.uri -> _)
    }.filterNot(_.isEmpty)

    combine(activeOnly).map(DataCubeKey.create(_, measures))
  }

  def combine[A](xs: Traversable[Traversable[A]]): Seq[Seq[A]] = xs.foldLeft(Seq(Seq.empty[A])) { (x, y) =>
    for (a <- x.view; b <- y) yield a :+ b
  }
}