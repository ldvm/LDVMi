package services.data.rdf.sparql.datacube

import data.models._
import play.api.libs.iteratee.Enumerator
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

  def getValues(dataSource: DataSource, uris: List[String]): Map[String, Enumerator[Option[DataCubeComponentValue]]] = {
    uris.reverse.map { uri =>
      uri -> sparqlEndpointService.getSelectQueryResult(dataSource, new DataCubeValuesQuery(uri), new DataCubeValuesExtractor)
    }.toMap
  }

  def sliceCubeAndPersist(v: Visualization, dataSource: DataSource, queryData: DataCubeQueryData, jsonQueryData: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult = {
    val token = MD5.hash(queryData.toString)

    val queries = TableQuery[VisualizationQueriesTable]
    queries.filter(_.token === token).delete
    queries += VisualizationQuery(0, v.id, token, jsonQueryData.toString)

    new DataCubeQueryResult(token, sliceCube(dataSource, queryData))
  }

  def combine[A](xs: Traversable[Traversable[A]]): Seq[Seq[A]] = xs.foldLeft(Seq(Seq.empty[A])) { (x, y) =>
    for (a <- x.view; b <- y) yield a :+ b
  }

  private def sliceCube(dataSource: DataSource, queryData: DataCubeQueryData): Option[DataCube] = {

    val allDimensionsHaveActiveValue = queryData.filters.componentFilters.filter(_.componentType == "dimension").forall(componentHasActiveValue)

    if (allDimensionsHaveActiveValue) {

      val cubeKeys = getCubeKeys(queryData)
      val cells = cubeKeys.par.map { k =>
        sparqlEndpointService.getSparqlQueryResult(dataSource, new DataCubeCellQuery(ObservationPattern(k)), new DataCubeCellExtractor(k))
      }.toList

      Some(DataCube(List(), slice(cells, queryData)))
    } else {
      None
    }
  }

  private def componentHasActiveValue(cf: DataCubeQueryComponentFilter): Boolean = {
    cf.valuesSettings.exists(_.isActive.getOrElse(false))
  }

  private def slice(cells: Seq[DataCubeCell], queryData: DataCubeQueryData): Option[SlicesByKey] = {
    val dimensions = queryData.filters.componentFilters.filter(_.componentType == "dimension")
    val activeMeasures = queryData.filters.componentFilters.filter(_.componentType == "measure").filter(_.isActive.getOrElse(false))
    val activeMeasuresCount = activeMeasures.size

    if (dimensions.nonEmpty) {
      val xAxis = dimensions.find(_.valuesSettings.count(_.isActive.getOrElse(false)) > 1).getOrElse(dimensions.head)

      activeMeasuresCount match {
        case 0 => None
        case 1 => dimensionSlices(cells, queryData, xAxis, dimensions)
        case _ if activeMeasuresCount > 1 => measuresSlices(cells, queryData, xAxis, activeMeasures)
      }
    } else {
      None
    }

  }

  private def dimensionSlices(cells: Seq[DataCubeCell], queryData: DataCubeQueryData, xAxis: DataCubeQueryComponentFilter, dimensions: Seq[DataCubeQueryComponentFilter]): Option[SlicesByKey] = {
    val dimensionsWithMoreValues = dimensions.filter(_.valuesSettings.count(_.isActive.getOrElse(false)) > 1)
    val measureUri = List(queryData.filters.componentFilters.find(c => c.componentType == "measure" && c.isActive.getOrElse(false)).head)
    dimensionsWithMoreValues.size match {
      case 0 => None
      case 1 => measuresSlices(cells, queryData, dimensionsWithMoreValues.head, measureUri)
      case 2 =>
        val secondaryAxis = dimensionsWithMoreValues(1)
        Some(xAxis.valuesSettings.filter(_.isActive.getOrElse(false)).map { value =>
          val keyFilterTuple = getKeyAndFilter(xAxis, value)

          measuresSlices(cells, queryData, secondaryAxis, measureUri, List(getKeyAndFilter(xAxis, value)._2)).map { slice =>
            keyFilterTuple._1 -> slice.map(_._2).reduce(_ ++ _)
          }
        }.filter(_.isDefined)
          .map(_.get)
          .toMap
        )
      case _ => None
    }
  }

  private def measuresSlices(cells: Seq[DataCubeCell], queryData: DataCubeQueryData, xAxis: DataCubeQueryComponentFilter, activeMeasures: Seq[DataCubeQueryComponentFilter], additionalConditions: Seq[DataCubeCell => Boolean] = List()): Option[SlicesByKey] = {
    Some(activeMeasures.map { m =>
      val activeValues = xAxis.valuesSettings.filter(_.isActive.getOrElse(false))
      m.uri -> activeValues.par.map { xValue =>

        val keyFilterTuple = getKeyAndFilter(xAxis, xValue)
        val allRules = additionalConditions ++ List(keyFilterTuple._2)
        val matchingCells = cells.find(allRules.reduceLeft((a, b) => c => a(c) && b(c)))

        keyFilterTuple._1 -> matchingCells.map(_.measureValues(m.uri)).flatten

      }.toList.toMap
    }.toMap)
  }

  private def getKeyAndFilter(xAxis: DataCubeQueryComponentFilter, xValue: DataCubeQueryValueFilter): (String, DataCubeCell => Boolean) = {
    (xValue.uri.getOrElse(xValue.label.get),
      if (xValue.label.isDefined) {
        c => c.key.dimensionLiteralKeys(xAxis.uri) == xValue.label.get
      } else {
        // (xValue.uri.isDefined)
        c => c.key.dimensionUriKeys(xAxis.uri) == xValue.uri.get
      })
  }

  private def getCubeKeys(queryData: DataCubeQueryData): Seq[DataCubeKey] = {
    val measures = queryData.filters.componentFilters.filter(m => m.componentType == "measure" && m.isActive.getOrElse(false)).map(_.uri)

    val activeOnly = queryData.filters.componentFilters.map { cf =>
      cf.valuesSettings.filter(_.isActive.getOrElse(false)).map(cf.uri -> _)
    }.filterNot(_.isEmpty)

    combine(activeOnly).map(DataCubeKey.create(_, measures))
  }
}