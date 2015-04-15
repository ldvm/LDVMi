package controllers

import model.entity.{PipelineEvaluationId, PipelineEvaluation}
import model.service.{DataSourceService, PipelineService}
import play.api.db.slick._
import play.api.mvc.{Result, Action, Controller}
import scaldi.{Injectable, Injector}
import play.api.Play.current
import views.VisualizerRoute
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

class VisualizationController(implicit inj: Injector) extends Controller with Injectable {

  val pipelineService = inject[PipelineService]
  val dataSourceService = inject[DataSourceService]
  val internalEndpoint = play.api.Play.configuration.getString("ldvmi.triplestore.push").getOrElse("")

  def dataSource = DBAction { implicit rws =>
    Ok(views.html.visualization.dataSource())
  }

  def fromFiles = Action.async(parse.maxLength(100 * 1024 * 1024, parse.multipartFormData)) { request =>
    Future {
      request.body.fold({ ms =>
        Redirect(routes.ApplicationController.index()).flashing("error" -> "Max size exceeded.")
      }, { body =>

        val files = body.files.filter(_.key == "ttlfile").map(f => (f.contentType, f.ref.file))
        val urnUuid = dataSourceService.createDataSourceFromFiles(files)


        val fileNames = body.files.filter(_.key == "ttlfile").map(_.filename)

        val combine = body.dataParts.get("combine").flatMap(_.headOption.map(_ == "true")).getOrElse(false)
        Redirect(
          routes.VisualizationController.discover(
            Some(internalEndpoint),
            urnUuid.map(u => "urn:" + u.toString),
            combine,
            Some(fileNames.mkString(", "))
          )
        )

      })
    }
  }

  def fromRemoteData = Action.async(parse.urlFormEncoded) { request =>
    Future {
      request.body.get("ttlurl").map { urls =>

        val sanitizedList = urls.flatMap(_.split("\n")).map(_.trim).filter(_.nonEmpty)
        val urn = dataSourceService.createDataSourceFromRemoteTtl(sanitizedList)

        val combine = request
          .body
          .get("combine")
          .flatMap(_.headOption.map(_ == "true"))
          .getOrElse(false)

        Redirect(
          routes.VisualizationController.discover(
            Some(internalEndpoint),
            urn.map(u => "urn:" + u.toString),
            combine,
            Some(sanitizedList.mkString(", "))
          )
        )

      }.getOrElse {
        Redirect(routes.ApplicationController.index()).flashing(
          "error" -> "Missing file")
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

  def treemap(pipelineEvaluationId: Long) = DBAction { implicit rws =>
    withEvaluation(pipelineEvaluationId) { e =>
      Ok(views.html.visualizer.treemap(e.id.get))
    }
  }

  private def withEvaluation(id: Long)(func: PipelineEvaluation => Result)(implicit session: Session): Result = {
    pipelineService.findEvaluationById(PipelineEvaluationId(id)).map(func).getOrElse(NotFound)
  }

  def discover(endpointUrl: Option[String] = None, graphUris: Option[String] = None, combine: Boolean = false, name: Option[String] = None) = Action {

    val n = if (combine) {1} else {0}

    val url: String = "/pipelines#/discover?endpointUrl=" +
      endpointUrl.orNull +
      graphUris.map("&graphUris=" + _).getOrElse("") +
      "&combine=" + n.toString +
      name.map("&name=" + _).getOrElse("")

    TemporaryRedirect(url)
  }

}