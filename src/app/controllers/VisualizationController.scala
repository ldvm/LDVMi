package controllers

import model.entity.{DataSourceTemplateId, PipelineEvaluation, PipelineEvaluationId}
import model.service.{DataSourceService, PipelineService}
import play.api.Play.current
import play.api.db.slick.{Session, _}
import play.api.libs.Files
import play.api.mvc.{Action, Controller, MultipartFormData, Result}
import scaldi.{Injectable, Injector}
import views.VisualizerRoute

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class VisualizationController(implicit inj: Injector) extends Controller with Injectable {

  val pipelineService = inject[PipelineService]
  val dataSourceService = inject[DataSourceService]

  def multiSource = DBAction { implicit rws =>
    Ok(views.html.visualization.multiSource())
  }

  def multiUpload = Action.async(parse.maxLength(200 * 1024 * 1024, parse.multipartFormData)) { request =>
    request.body.fold({ ms =>
      Future.successful(Redirect(routes.ApplicationController.index()).flashing("error" -> "Max size exceeded."))
    }, { body =>
      DB.withSession { implicit s =>
        val eventuallyDatasourceIds = Future.sequence(Seq(
          upload(body),
          download(body),
          endpoints(body)
        ))

        val combine = body
          .dataParts
          .get("combine")
          .flatMap(_.headOption.map(_ == "true"))
          .getOrElse(false)

        eventuallyDatasourceIds.map { ids =>
          Redirect(routes.VisualizationController.discover(ids.flatten.map(_.id).toList, combine))
        }
      }
    })
  }

  private def upload(body: MultipartFormData[Files.TemporaryFile])(implicit session: Session): Future[Seq[DataSourceTemplateId]] = Future {
    val files = body.files.filter(_.key == "ttlfile")
    dataSourceService.createDataSourceFromFiles(files).toSeq
  }

  private def download(body: MultipartFormData[Files.TemporaryFile])(implicit session: Session): Future[Seq[DataSourceTemplateId]] = Future {
    body.dataParts.get("ttlurl").flatMap { urls =>
      val sanitizedList = urls.flatMap(_.split("\n")).map(_.trim).filter(_.nonEmpty)
      dataSourceService.createDataSourceFromRemoteTtl(sanitizedList)
    }.toSeq
  }

  private def endpoints(body: MultipartFormData[Files.TemporaryFile])(implicit session: Session): Future[Seq[DataSourceTemplateId]] = Future {
    val maybeEndpoint = body.dataParts.get("endpointUrl")
    val maybeGraphUris = body.dataParts.get("graphUris")

    if (maybeEndpoint.isEmpty || maybeGraphUris.isEmpty) {
      Seq()
    } else {
      val links = maybeEndpoint.get.zip(maybeGraphUris.get)
      links.filter(_._1.trim.nonEmpty).flatMap { case (endpointUrl, graphUris) =>
        val graphs = graphUris.split("\\s+").toSeq
        dataSourceService.createDataSourceFromUris(endpointUrl.trim, if (graphs.nonEmpty) {Some(graphs)} else None)
      }
    }
  }

  def visualize(pipelineEvaluationId: Long) = DBAction { implicit rws =>
    withEvaluation(pipelineEvaluationId) { e =>
      val maybeVisualizerTemplateUri = e.pipeline.componentInstances.find(!_.hasOutput).map(_.componentTemplate.uri)

      maybeVisualizerTemplateUri.map { uri =>
        TemporaryRedirect(VisualizerRoute.route(uri, e.id.get))
      }.getOrElse {
        NotFound
      }
    }

  }

  trait HierarchyVisualisationTemplate {
    def apply(evaluationId: PipelineEvaluationId, schemeUri: String): play.twirl.api.HtmlFormat.Appendable
  }

  def cluster = skosVisualisation(views.html.visualizer.hierarchy.cluster.apply) _

  def tree = skosVisualisation(views.html.visualizer.hierarchy.tree.apply) _

  def force = skosVisualisation(views.html.visualizer.hierarchy.force.apply) _

  def partition = skosVisualisation(views.html.visualizer.hierarchy.partition.apply) _

  def bilevel = skosVisualisation(views.html.visualizer.hierarchy.bilevel.apply) _

  def packLayout = skosVisualisation(views.html.visualizer.hierarchy.packLayout.apply) _

  def sunburst = skosVisualisation(views.html.visualizer.hierarchy.sunburst.apply) _

  def treemap = skosVisualisation(views.html.visualizer.hierarchy.treemap.apply) _

  def radialTree = skosVisualisation(views.html.visualizer.hierarchy.radialTree.apply) _

  private def skosVisualisation(template: (PipelineEvaluationId, String, String) => play.twirl.api.HtmlFormat.Appendable)
    (pipelineEvaluationId: Long, schemeUri: String, language: String) = DBAction { implicit rws =>
    println(language)
    withEvaluation(pipelineEvaluationId) { e =>
      Ok(template(e.id.get, schemeUri, language))
    }
  }

  private def withEvaluation(id: Long)(func: PipelineEvaluation => Result)(implicit session: Session): Result = {
    pipelineService.findEvaluationById(PipelineEvaluationId(id)).map(func).getOrElse(NotFound)
  }

  def discover(dataSourceTemplateIds: List[Long], combine: Boolean = false, lucky: Boolean = false) = DBAction { rws =>

    val n = if (combine) {1} else {0}
    val l = if (lucky) {1} else {0}

    val url: String = "/pipelines#/discover?" +
      dataSourceTemplateIds.map(i => "dataSourceTemplateIds=" + i).mkString("&") +
      "&combine=" + n.toString +
      "&lucky=" + l.toString

    TemporaryRedirect(url)
  }

}