package controllers

import model.entity.{PipelineEvaluation, PipelineEvaluationId}
import model.service.{DataSourceService, PipelineService}
import play.api.Play.current
import play.api.db.slick._
import play.api.mvc.{Action, Controller, Result}
import scaldi.{Injectable, Injector}
import views.VisualizerRoute

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class VisualizationController(implicit inj: Injector) extends Controller with Injectable {

  val pipelineService = inject[PipelineService]
  val dataSourceService = inject[DataSourceService]

  def dataSource = DBAction { implicit rws =>
    Ok(views.html.visualization.dataSource())
  }

  def fromFiles = Action.async(parse.maxLength(100 * 1024 * 1024, parse.multipartFormData)) { request =>
    Future {
      request.body.fold({ ms =>
        Redirect(routes.ApplicationController.index()).flashing("error" -> "Max size exceeded.")
      }, { body =>

        DB.withSession { implicit s =>
          val files = body.files.filter(_.key == "ttlfile")
          val maybeDataSourceId = dataSourceService.createDataSourceFromFiles(files)

          maybeDataSourceId.map { i =>
            val combine = body
              .dataParts
              .get("combine")
              .flatMap(_.headOption.map(_ == "true"))
              .getOrElse(false)

            Redirect(routes.VisualizationController.discover(maybeDataSourceId.map(_.id), combine))
          }.getOrElse {
            Redirect(routes.ApplicationController.index()).flashing("error" -> "No data in files.")
          }
        }

      })
    }
  }

  def fromUris = Action.async(parse.urlFormEncoded) { request =>
    Future {
      DB.withSession { implicit s =>
        request.body.get("ttlurl").map { urls =>

          val sanitizedList = urls.flatMap(_.split("\n")).map(_.trim).filter(_.nonEmpty)
          val maybeDataSourceId = dataSourceService.createDataSourceFromRemoteTtl(sanitizedList)

          val combine = request
            .body
            .get("combine")
            .flatMap(_.headOption.map(_ == "true"))
            .getOrElse(false)

          Redirect(routes.VisualizationController.discover(maybeDataSourceId.map(_.id), combine))

        }.getOrElse {
          Redirect(routes.ApplicationController.index()).flashing(
            "error" -> "Missing file")
        }
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

  def treemap(pipelineEvaluationId: Long, schemeUri: String) = DBAction { implicit rws =>
    withEvaluation(pipelineEvaluationId) { e =>
      Ok(views.html.visualizer.hierarchy.treemap(e.id.get, schemeUri))
    }
  }

  private def withEvaluation(id: Long)(func: PipelineEvaluation => Result)(implicit session: Session): Result = {
    pipelineService.findEvaluationById(PipelineEvaluationId(id)).map(func).getOrElse(NotFound)
  }

  def discover(dataSourceTemplateId: Option[Long], combine: Boolean = false) = DBAction { rws =>

    val n = if (combine) {1} else {0}

    val url: String = "/pipelines#/discover?" +
      "dataSourceTemplateId=" + dataSourceTemplateId.orNull +
      "&combine=" + n.toString

    TemporaryRedirect(url)
  }

}