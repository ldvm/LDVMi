package model.service.impl

import java.util.UUID

import com.hp.hpl.jena.rdf.model.{Model, ModelFactory}
import com.hp.hpl.jena.vocabulary.RDF
import model.entity.{DataSourceTemplate, DataSourceTemplateId}
import model.rdf.vocabulary.{DSPARQL, SD}
import model.repository.{PipelineRepository, ComponentTemplateRepository, DataSourceTemplateRepository}
import model.service.{ComponentTemplateService, DataSourceService, GraphStoreProtocol}
import play.api.Play.current
import play.api.db.slick.Session
import play.api.libs.Files
import play.api.mvc.MultipartFormData
import scaldi.{Injectable, Injector}

import scala.io.{Codec, Source}

class DataSourceServiceImpl(implicit inj: Injector) extends DataSourceService with Injectable {

  val repository = inject[DataSourceTemplateRepository]

  val graphStore = inject[GraphStoreProtocol]
  val internalEndpoint = play.api.Play.configuration.getString("ldvmi.triplestore.push").getOrElse("")
  val componentRepository = inject[ComponentTemplateRepository]
  val dataSourceTemplateRepository = inject[DataSourceTemplateRepository]
  val componentTemplateService = inject[ComponentTemplateService]

  def createDataSourceFromRemoteTtl(urls: Seq[String])(implicit session: Session): Option[DataSourceTemplateId] = {

    urls match {
      case u if u.nonEmpty => withRandomGraphUri { r =>
        val dataSourceName = "Downloaded TTLs"
        val dataSourceDescription = u.mkString(", ")
        val dataSourceId = createDataSource(dataSourceName, Some(dataSourceDescription), r)

        u.foreach { uri =>
          implicit val codec = Codec("UTF-8")
          val source = Source.fromURL(uri)
          val ttl = source.mkString
          source.close()
          graphStore.pushToTripleStore(ttl, r.graphUri)
        }

        Some(dataSourceId)
      }
      case _ => None
    }
  }


  def createDataSourceFromFiles(files: Seq[MultipartFormData.FilePart[Files.TemporaryFile]], maybeUrn: Option[UUID] = None)(implicit session: Session): Option[DataSourceTemplateId] = {
    files match {
      case f if f.nonEmpty => withRandomGraphUri(maybeUrn) { r =>
        val dataSourceName = f.map(_.filename).mkString(", ")

        val dataSourceId = findDataSourceByGraph(r)
          .flatMap(_.id)
          .getOrElse(createDataSource(dataSourceName, None, r))

        f.foreach { file =>
          graphStore.pushToTripleStore(file.ref.file, r.graphUri, file.contentType)
        }

        Some(dataSourceId)
      }
      case _ => None
    }
  }

  def findDataSourceByGraph(graph: PersistentGraph)(implicit session: Session): Option[DataSourceTemplate] = {
    dataSourceTemplateRepository.findByUri(graph.datasourceUri)
  }

  private def withRandomGraphUri[R](maybeUrn: Option[UUID] = None)(action: PersistentGraph => R): R = {
    action(new PersistentGraph(maybeUrn))
  }

  private def withRandomGraphUri[R](action: PersistentGraph => R): R = {
    withRandomGraphUri(None)(action)
  }

  private def config(endpointUrl: String, maybeGraphUris: Option[Seq[String]]): Model = {
    val model = ModelFactory.createDefaultModel()

    val configResource = model.createResource()
    configResource.addProperty(RDF.`type`, DSPARQL.SparqlEndpointDataSourceConfiguration)

    val serviceResource = model.createResource()
    val endpointResource = model.createResource(endpointUrl)
    serviceResource.addProperty(SD.endpoint, endpointResource)

    maybeGraphUris.foreach { graphUris =>
      val dataSetResource = model.createResource()
      serviceResource.addProperty(SD.defaultDataset, dataSetResource)

      graphUris.foreach { graphUri =>
        val graphResource = model.createResource(graphUri)
        val namedGraphResource = model.createResource()
        namedGraphResource.addProperty(SD.name, graphResource)
        dataSetResource.addProperty(SD.namedGraph, namedGraphResource)
      }
    }

    configResource.addProperty(DSPARQL.service, serviceResource)

    model
  }

  def createDataSourceFromUris(endpointUrl: String, graphUris: Option[Seq[String]])(implicit session: Session): Option[DataSourceTemplateId] = {

    val resourceUri = endpointUrl
    val dataPortTemplate = model.dto.DataPortTemplate(resourceUri + "/output", None, None)
    val outputTemplate = model.dto.OutputTemplate(dataPortTemplate, None)

    val componentTemplate = model.dto.ComponentTemplate(
      resourceUri,
      Some(endpointUrl),
      None,
      Some(config(endpointUrl, graphUris.map(_.filter(_.trim.nonEmpty)))),
      Seq(),
      Some(outputTemplate),
      Seq(),
      Seq(),
      isTemporary = true
    )

    val savedId = componentTemplateService.save(componentTemplate)

    Some(dataSourceTemplateRepository.save(DataSourceTemplate(None, savedId)))
  }

  private def createDataSource(name: String, maybeDescription: Option[String], graph: PersistentGraph)(implicit session: Session): DataSourceTemplateId = {

    val dataPortTemplate = model.dto.DataPortTemplate(graph.datasourceUri + "/output", None, None)
    val outputTemplate = model.dto.OutputTemplate(dataPortTemplate, None)

    val componentTemplate = model.dto.ComponentTemplate(
      graph.datasourceUri,
      Some(name),
      maybeDescription,
      Some(config(internalEndpoint, Some(Seq(graph.graphUri)))),
      Seq(),
      Some(outputTemplate),
      Seq(),
      Seq(),
      isTemporary = true
    )

    val savedId = componentTemplateService.save(componentTemplate)

    dataSourceTemplateRepository.save(DataSourceTemplate(None, savedId))
  }

}

class PersistentGraph(maybeUrn: Option[UUID] = None) {
  val uuid = maybeUrn.getOrElse(UUID.randomUUID())

  def graphUri: String = "urn:" + uuid.toString

  def datasourceUri: String = "urn:datasources/" + uuid.toString
}
