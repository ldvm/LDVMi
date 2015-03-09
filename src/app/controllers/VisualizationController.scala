package controllers

import model.entity.{PipelineEvaluation, PipelineEvaluationId}
import model.service.PipelineService
import play.api.db.slick._
import play.api.mvc.{Result, Action, Controller}
import scaldi.{Injectable, Injector}
import views.VisualizerRoute

class VisualizationController(implicit inj: Injector) extends Controller with Injectable {

  val pipelineService = inject[PipelineService]

  def visualize(pipelineEvaluationId: Long) = DBAction { implicit rws =>

    withEvaluation(pipelineEvaluationId) { e =>

      val maybeVisualizerTemplateUri = e.pipeline.componentInstances.find(!_.hasOutput).map(_.componentTemplate.uri)

      maybeVisualizerTemplateUri.map {uri =>
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

  private def withEvaluation(id: Long)(func: PipelineEvaluation => Result)(implicit session: Session) : Result = {
    pipelineService.findEvaluationById(PipelineEvaluationId(id)).map(func).getOrElse(NotFound)
  }

}