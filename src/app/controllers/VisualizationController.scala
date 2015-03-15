package controllers

import java.io.File
import java.net.URL
import java.util.UUID

import model.entity.{PipelineEvaluation, PipelineEvaluationId}
import model.rdf.Graph
import model.service.PipelineService
import org.apache.http.auth.{AuthScope, UsernamePasswordCredentials}
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.{ContentType, FileEntity, StringEntity}
import org.apache.http.impl.client.DefaultHttpClient
import play.api.db.slick._
import play.api.mvc.{Action, Controller, Result}
import scaldi.{Injectable, Injector}
import views.VisualizerRoute

class VisualizationController(implicit inj: Injector) extends Controller with Injectable {

  val pipelineService = inject[PipelineService]

  def ttlds = DBAction { implicit rws =>
    Ok(views.html.visualization.ttlds())
  }

  def ttlupload = Action(parse.maxLength(100 * 1024 * 1024, parse.multipartFormData)) { request =>
    request.body.fold({ ms =>
      Redirect(routes.ApplicationController.index()).flashing("error" -> "Max size exceeded.")
    }, { body =>
        body.file("ttlfile").map { ttl =>
        forwardToTriplestore(ttl.ref.file, ttl.contentType).map { urn =>
          val combine = body.dataParts.get("combine").flatMap(_.headOption.map(_ == "true")).getOrElse(false)
          Redirect(routes.VisualizationController.discover(Some("http://live.payola.cz:8890/sparql"), Some(urn), combine, Some(ttl.filename)))
        }.getOrElse {
          Redirect(routes.ApplicationController.index()).flashing("error" -> "Not a valid TTL file.")
        }
      }.getOrElse {
        Redirect(routes.ApplicationController.index()).flashing(
          "error" -> "Missing file")
      }
    })
  }

  private def forwardToTriplestore(file: File, contentType: Option[String]) ={

      val endpoint: String = "http://live.payola.cz:8890"
      val graphUri: String = "urn:"+UUID.randomUUID().toString

      val requestUri = String.format("%s/sparql-graph-crud-auth?graph-uri=%s", endpoint, graphUri)

      val credentials = new UsernamePasswordCredentials("dba", "dba")
      val httpClient = new DefaultHttpClient()
      val post = new HttpPost(requestUri)
      post.addHeader("X-Requested-Auth", "Digest")
      try {
        httpClient.getCredentialsProvider.setCredentials(AuthScope.ANY, credentials)
        val fileEntity = new FileEntity(file, ContentType.create(contentType.getOrElse("text/turtle")))

        post.setEntity(fileEntity)
        val response = httpClient.execute(post)

        if(response.getStatusLine.getStatusCode > 400) {
          None
        } else {
          Some(graphUri)
        }
      }
      catch {
        case e: Throwable => throw e
      }
      finally {
        httpClient.getConnectionManager.shutdown()
      }
  }

  def ttldownload = Action(parse.urlFormEncoded) { request =>
    request.body.get("ttlurl").map { url =>
      Graph(new URL(url.head)).map { g =>
        val urn = g.pushToRandomGraph
        val combine = request.body.get("combine").flatMap(_.headOption.map(_ == "true")).getOrElse(false)
        Redirect(routes.VisualizationController.discover(Some("http://live.payola.cz:8890/sparql"), Some(urn), combine, url.headOption))
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

  def discover(endpointUrl: Option[String] = None, graphUris: Option[String] = None, combine: Boolean = false, name: Option[String] = None) = Action {

    val n = if(combine){1}else{0}

    val url: String = "/pipelines#/discover?endpointUrl=" +
      endpointUrl.orNull +
      graphUris.map("&graphUris=" + _).getOrElse("") +
        "&combine=" + n.toString +
        name.map("&name=" + _).getOrElse("")

    TemporaryRedirect(url)
  }

}