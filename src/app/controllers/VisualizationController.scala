package controllers

import model.entity.{PipelineEvaluation, PipelineEvaluationId}
import model.rdf.Graph
import model.service.PipelineService
import play.api.db.slick._
import play.api.mvc.{Action, Controller, Result}
import scaldi.{Injectable, Injector}
import views.VisualizerRoute

class VisualizationController(implicit inj: Injector) extends Controller with Injectable {

  val pipelineService = inject[PipelineService]

  def ttlds = DBAction { implicit rws =>
    Ok(views.html.visualization.ttlds())
  }

  def ttlupload = Action(parse.multipartFormData) { request =>
    request.body.file("ttlfile").map { ttl =>
      val filename = ttl.filename
      val contentType = ttl.contentType
      Graph(ttl.ref.file).map { g =>
        val urn = g.pushToRandomGraph
        Redirect(routes.VisualizationController.discover(Some("http://live.payola.cz:8890/sparql"), Some(urn)))
      }.getOrElse {
        UnprocessableEntity
      }
    }.getOrElse {
      Redirect(routes.ApplicationController.index()).flashing(
        "error" -> "Missing file")
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

  def treemap(pipelineEvaluationId: Long) = DBAction { implicit rws =>
    withEvaluation(pipelineEvaluationId) { e =>
      Ok(views.html.visualizer.treemap(e.id.get))
    }
  }

  private def withEvaluation(id: Long)(func: PipelineEvaluation => Result)(implicit session: Session): Result = {
    pipelineService.findEvaluationById(PipelineEvaluationId(id)).map(func).getOrElse(NotFound)
  }

  def discover(endpointUrl: Option[String] = None, graphUris: Option[String] = None) = Action {

    TemporaryRedirect("/pipelines#/discover?endpointUrl=" + endpointUrl.orNull + graphUris.map("&graphUris=" + _).getOrElse(""))
  }

}