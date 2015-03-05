package controllers

import model.entity.PipelineEvaluationId
import play.api.mvc._
import scaldi.{Injectable, Injector}

class VisualizationController(implicit inj: Injector) extends Controller with Injectable {

  def treemap(pipelineEvaluationId: Long) = Action {
    val wrappedId = PipelineEvaluationId(pipelineEvaluationId)
    Ok(views.html.visualizer.treemap(wrappedId))
  }

}