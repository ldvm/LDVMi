package model.rdf.sparql.datacube

import model.service.{PipelineService, SessionScoped}
import model.entity.{PipelineEvaluationQuery, PipelineEvaluation}
import model.rdf.sparql.datacube.extractor._
import model.rdf.sparql.datacube.query._
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpoint, SparqlEndpointService, ValueFilter}
import play.api.libs.iteratee.Enumerator
import play.api.libs.json.JsValue
import scaldi.{Injectable, Injector}
import utils.MD5

class DataCubeServiceImpl(implicit val inj: Injector) extends DataCubeService with SessionScoped with Injectable {

  var sparqlEndpointService = inject[SparqlEndpointService]
  var pipelineService = inject[PipelineService]

  def getDatasets(evaluation: PipelineEvaluation): Seq[DataCubeDataset] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new DataCubeDatasetsQuery, new DataCubeDatasetsExtractor).get
  }

  private def evaluationToSparqlEndpoint(evaluation: PipelineEvaluation): GenericSparqlEndpoint = {
    withSession { implicit session =>
      val evaluationResults = evaluation.results
      evaluationResults.map { result => new GenericSparqlEndpoint(result.endpointUrl, List(), result.graphUri.map(_.split("\n")).toSeq.flatten)}.head
    }
  }

  def getDataStructures(evaluation: PipelineEvaluation): Seq[DataCubeDataStructure] = {
    sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new DataCubeDataStructuresQuery, new DataCubeDataStructuresExtractor).get
  }

  def getDataStructureComponents(evaluation: PipelineEvaluation, uri: String, isTolerant: Boolean = false): Seq[DataCubeComponent] = {
    List("dimension", "measure", "attribute").par.map { componentType =>
      sparqlEndpointService.getResult(
        evaluationToSparqlEndpoint(evaluation),
        new DataCubeComponentsQuery(uri, componentType, isTolerant),
        new DataCubeComponentsExtractor).get
    }.toList.distinct.flatten
  }

  def getValues(evaluation: PipelineEvaluation, uris: List[String]): Map[String, Option[Seq[DataCubeComponentValue]]] = {
    uris.map { uri =>
      uri -> sparqlEndpointService.getResult(evaluationToSparqlEndpoint(evaluation), new DataCubeValuesQuery(uri), new DataCubeValuesExtractor)
    }.toMap
  }


  def sliceCubeAndPersist(evaluation: PipelineEvaluation, queryData: DataCubeQueryData, jsonQueryData: JsValue)
    (implicit rs: play.api.db.slick.Config.driver.simple.Session): DataCubeQueryResult = {
    val token = MD5.hash(queryData.toString)

    pipelineService.setEvaluationQuery(token, PipelineEvaluationQuery(None, evaluation.id.get, token, jsonQueryData.toString()))

    new DataCubeQueryResult(token, sliceCube(evaluationToSparqlEndpoint(evaluation), queryData))
  }

  def combine[A](xs: Traversable[Traversable[A]]): Seq[Seq[A]] = xs.foldLeft(Seq(Seq.empty[A])) { (x, y) =>
    for (a <- x.view; b <- y) yield a :+ b
  }

  private def sliceCube(sparqlEndpoint: SparqlEndpoint, queryData: DataCubeQueryData): Option[DataCube] = {

    val allDimensionsHaveActiveValue = queryData.filters.components.filter(_.`type` == "dimension").forall(componentHasActiveValue)

    if (allDimensionsHaveActiveValue) {

      val cubeKeys = getCubeKeys(queryData)
      val cells = cubeKeys.par.map { k =>
        sparqlEndpointService.getResult(sparqlEndpoint, new DataCubeCellQuery(ObservationPattern(k)), new DataCubeCellExtractor(k)).get
      }.toList

      Some(DataCube(List(), slice(cells, queryData)))
    } else {
      None
    }
  }

  private def componentHasActiveValue(cf: DataCubeQueryComponentFilter): Boolean = {
    cf.values.exists(_.isActive.getOrElse(false))
  }

  private def slice(cells: Seq[DataCubeCell], queryData: DataCubeQueryData): Option[SlicesByKey] = {
    val dimensions = queryData.filters.components.filter(_.`type` == "dimension")
    val activeMeasures = queryData.filters.components.filter(_.`type` == "measure").filter(_.isActive.getOrElse(false))
    val activeMeasuresCount = activeMeasures.size

    if (dimensions.nonEmpty) {
      val xAxis = dimensions.find(_.values.count(_.isActive.getOrElse(false)) > 1).getOrElse(dimensions.head)

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
    val dimensionsWithMoreValues = dimensions.filter(_.values.count(_.isActive.getOrElse(false)) > 1)
    val measureUri = List(queryData.filters.components.find(c => c.`type` == "measure" && c.isActive.getOrElse(false)).head)
    dimensionsWithMoreValues.size match {
      case 0 => None
      case 1 => measuresSlices(cells, queryData, dimensionsWithMoreValues.head, measureUri)
      case 2 =>
        val secondaryAxis = dimensionsWithMoreValues(1)
        Some(xAxis.values.filter(_.isActive.getOrElse(false)).map { value =>
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
      val activeValues = xAxis.values.filter(_.isActive.getOrElse(false))
      m.componentUri -> activeValues.par.map { xValue =>

        val keyFilterTuple = getKeyAndFilter(xAxis, xValue)
        val allRules = additionalConditions ++ List(keyFilterTuple._2)
        val matchingCells = cells.find(allRules.reduceLeft((a, b) => c => a(c) && b(c)))

        keyFilterTuple._1 -> matchingCells.flatMap(_.measureValues(m.componentUri))

      }.toList.toMap
    }.toMap)
  }

  private def getKeyAndFilter(xAxis: DataCubeQueryComponentFilter, xValue: ValueFilter): (String, DataCubeCell => Boolean) = {
    (xValue.uri.getOrElse(xValue.label.get),
      if (xValue.label.isDefined) {
        c => c.key.dimensionLiteralKeys(xAxis.componentUri) == xValue.label.get
      } else {
        c => c.key.dimensionUriKeys(xAxis.componentUri) == xValue.uri.get
      })
  }

  private def getCubeKeys(queryData: DataCubeQueryData): Seq[DataCubeKey] = {
    val measures = queryData.filters.components.filter(m => m.`type` == "measure" && m.isActive.getOrElse(false)).map(_.componentUri)

    val activeOnly = queryData.filters.components.map { cf =>
      cf.values.filter(_.isActive.getOrElse(false)).map(cf.componentUri -> _)
    }.filterNot(_.isEmpty)

    combine(activeOnly).map(DataCubeKey.create(_, measures))
  }
}