package model.service.component

import java.util.UUID

import akka.actor.Props
import com.hp.hpl.jena.sparql.engine.http.QueryExceptionHTTP
import model.entity.ComponentInstance
import model.rdf.sparql.GenericSparqlEndpoint
import model.service.GraphStore
import play.api.Play.current
import play.api.libs.concurrent.Akka

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.collection.JavaConversions._

class GeocoderPlugin(internalComponent: InternalComponent, graphStore: GraphStore) extends AnalyzerPlugin {
  override def run(dataReferences: Seq[DataReference], reporterProps: Props): Future[(String, Option[String])] = {
    val resultGraph = "urn:" + UUID.randomUUID().toString

    val reporter = Akka.system.actorOf(reporterProps)
    reporter ! "Running implementation of GEOcoder plugin"

    Future {

      val referencesByPortUris = dataReferencesByPortTemplateUri(dataReferences)
      val datasetRef = referencesByPortUris("http://ldvm.opendata.cz/resource/template/analyzer/ruian/geocoder/input/dataset")
      val geoRef = referencesByPortUris("http://ldvm.opendata.cz/resource/template/analyzer/ruian/geocoder/input/ruian")

      if(datasetRef.isDefined && geoRef.isDefined){
        try {

        val geoQueryPattern =
          """
            |prefix xsd:	<http://www.w3.org/2001/XMLSchema#>
            |		prefix rdf:	<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            |		prefix skos:	<http://www.w3.org/2004/02/skos/core#>
            |		prefix s:	<http://schema.org/>
            |		prefix ogcgml:	<http://www.opengis.net/ont/gml#>
            |		prefix ruian:	<http://ruian.linked.opendata.cz/ontology/>
            |		CONSTRUCT {
            |		  <%subject%>	s:geo ?geo .
            |		  ?geo	rdf:type	s:GeoCoordinates ;
            |			  s:longitude	?lng ;
            |			  s:latitude	?lat .
            |		} WHERE {
            |		  <%town%>	ruian:definicniBod	?definicniBod .
            |
            |		  ?definicniBod	rdf:type	ogcgml:MultiPoint ;
            |			  ogcgml:pointMember	?pointMember .
            |
            |		  ?pointMember rdf:type	ogcgml:Point ;
            |			  s:geo ?geo .
            |		  ?geo	rdf:type	s:GeoCoordinates ;
            |			  s:longitude	?lng ;
            |			  s:latitude	?lat .
            |		}
          """.stripMargin

        val geoEndpoint = new GenericSparqlEndpoint(geoRef.get.endpointUri, geoRef.get.graphUri.toSeq, List())

        if(datasetRef.get.endpointUri == graphStore.endpointUrl) {
          val dataQuery = "CONSTRUCT { ?s <http://ruian.linked.opendata.cz/ontology/links/obec> ?o } WHERE { ?s <http://ruian.linked.opendata.cz/ontology/links/obec> ?o }"
          val dataEndpoint = new GenericSparqlEndpoint(datasetRef.get.endpointUri, datasetRef.get.graphUri.toSeq, List())
          val dataModel = dataEndpoint.queryExecutionFactory()(dataQuery).execConstruct()

          // for each entity from model having geolink, add another data
          val p = dataModel.getProperty("http://ruian.linked.opendata.cz/ontology/links/obec")
          val entities = dataModel.listStatements(null, p, null).toList

          reporter ! "Trying to link " + entities.size() + " geo entities"

          entities.foreach { e =>
            val q = geoQueryPattern
              .replaceAll("%town%", e.getObject.asResource().getURI)
              .replaceAll("%subject%", e.getSubject.asResource().getURI)

            val model = geoEndpoint.queryExecutionFactory()(q).execConstruct()

            dataModel.add(model)
          }

          graphStore.pushToTripleStore(dataModel, datasetRef.get.graphUri.head)(reporterProps)
          (graphStore.endpointUrl, Some(datasetRef.get.graphUri.head))
        }else {
          val dataQuery = "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"
          val dataEndpoint = new GenericSparqlEndpoint(datasetRef.get.endpointUri, datasetRef.get.graphUri.toSeq, List())
          val dataModel = dataEndpoint.queryExecutionFactory()(dataQuery).execConstruct()

          // for each entity from model having geolink, add another data
          val p = dataModel.getProperty("http://ruian.linked.opendata.cz/ontology/links/obec")
          val entities = dataModel.listStatements(null, p, null).toList

          reporter ! "Trying to link " + entities.size() + " geo entities"

          entities.foreach { e =>
            val q = geoQueryPattern
              .replaceAll("%town%", e.getObject.asResource().getURI)
              .replaceAll("%subject%", e.getSubject.asResource().getURI)

            val model = geoEndpoint.queryExecutionFactory()(q).execConstruct()

            dataModel.add(model)
          }

          graphStore.pushToTripleStore(dataModel, resultGraph)(reporterProps)
          (graphStore.endpointUrl, Some(resultGraph))
        }
      } catch {
        case e: QueryExceptionHTTP => {
          reporter ! "Error when querying: " + e.getResponseCode + " : " + e.getResponseMessage
          println(e.getResponseCode + " : " + e.getResponseMessage )
          (graphStore.endpointUrl, Some(resultGraph))
        }
        case e: Throwable => {
          println(e)
          (graphStore.endpointUrl, Some(resultGraph))
        }
      }
      }else{
        (graphStore.endpointUrl, Some(resultGraph))
      }
    }
  }

  override def componentInstance: ComponentInstance = internalComponent.componentInstance
}
