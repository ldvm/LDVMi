package model.rdf.sparql.fresnel.extractor

import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.fresnel.{Lens, ResourceThroughLens}
import model.rdf.sparql.fresnel.query.ResourcesThroughLensQuery
import model.rdf.sparql.rgml.models.Edge
import model.rdf.sparql.rgml.query.EdgesQuery
import model.rdf.vocabulary.RGML
import org.apache.jena.query.QueryExecution
import org.apache.jena.rdf.model.{Model, ModelFactory}
import org.apache.jena.vocabulary.RDF

import scala.collection.JavaConversions._

class ResourcesThroughLensExtractor(lens: Lens) extends QueryExecutionResultExtractor[ResourcesThroughLensQuery, Seq[ResourceThroughLens]] {

  def extract(input: QueryExecution): Option[Seq[ResourceThroughLens]] = {

    val m : Model = ModelFactory.createDefaultModel()

    try {
      val model = input.execConstruct()
      val resourceStatements = model.listResourcesWithProperty(RDF.`type`, m.createProperty(lens.domain)).toList
      val propertyUris = lens.showProperties map (p => m.createProperty(p))

      Some(resourceStatements.map { r =>
        val resource = r.asResource()
        val uri = resource.getURI
        val properties = propertyUris
          .filter(p => resource.hasProperty(p))
          .map(p => (p.getURI, LocalizedValue.create(resource, p)))
          .toMap

        ResourceThroughLens(uri, properties)
      })
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
