package controllers.api

import java.io.FileInputStream

import com.hp.hpl.jena.rdf.model.ModelFactory
import play.api.mvc.{Action, Controller}
import scaldi.{Injectable, Injector}

class ComponentApiController(implicit inj: Injector) extends Controller with Injectable {

  def ttl = Action(parse.multipartFormData) { request =>
    request.body.file("file").map { ttlFile =>

      val model = ModelFactory.createDefaultModel()
      model.read("https://raw.githubusercontent.com/payola/ldvm/master/rdf/vocabulary/ldvm-vocab.ttl", "TURTLE")
      model.read(new FileInputStream(ttlFile.ref.file), null, "TURTLE")

      Ok("File uploaded")
    }.getOrElse {
      NotAcceptable
    }
  }

}
