package controllers.appgen.api

import controllers.appgen.api.rest.RestController
import model.appgen.service.VisualizerService
import model.appgen.rest.EmptyRequest._
import scaldi.Injector
import model.appgen.rest.Response._
import model.rdf.sparql.fresnel.extractor.LensesByPurposeExtractor
import model.rdf.sparql.fresnel.query.LensesByPurposeQuery
import model.rdf.sparql.{GenericSparqlEndpoint, SparqlEndpointService}
import org.apache.jena.sparql.engine.http.QueryExceptionHTTP
import play.api.Play.current

class CommonApiController(implicit inj: Injector) extends RestController {
  var sparqlEndpointService = inject[SparqlEndpointService]
  val visualizerService = inject[VisualizerService]

  def getVisualizers = RestAction[EmptyRequest] { implicit request => json =>
    Ok(SuccessResponse(data = Seq(
      "visualizers" -> visualizerService.getVisualizers
    )))
  }

  def getVirtuosoStatus = RestAction[EmptyRequest] { implicit request => json =>
    val endpointUrl = current.configuration.getString("ldvmi.triplestore.push").get

    try {
      // Make a simple quick SPARQL request to Virtuoso to check if it's running.
      val endpoint = new GenericSparqlEndpoint(endpointUrl)
      sparqlEndpointService.getResult(endpoint,
        new LensesByPurposeQuery("blah blah blah"),
        new LensesByPurposeExtractor
      )
      Ok(SuccessResponse("Ok"))
    } catch {
      case qEx: QueryExceptionHTTP =>
        BadRequest(ErrorResponse("Unable to connect to Virtuoso at " + endpointUrl + "! Most features will not be available."))
    }
  }
}
