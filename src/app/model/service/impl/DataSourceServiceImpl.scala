package model.service.impl

import java.util.UUID

import com.hp.hpl.jena.rdf.model.{ModelFactory, Model}
import com.hp.hpl.jena.vocabulary.RDF
import model.entity.{DataSourceTemplate, DataSourceTemplateId}
import model.rdf.vocabulary.{SD, DSPARQL}
import model.repository.{ComponentTemplateRepository, DataSourceTemplateRepository}
import model.service.{ComponentTemplateService, DataSourceService, GraphStoreProtocol}
import play.api.Play.current
import play.api.db.slick.Session
import play.api.libs.Files
import play.api.mvc.MultipartFormData
import scaldi.{Injectable, Injector}

import scala.io.Source

class DataSourceServiceImpl(implicit inj: Injector) extends DataSourceService with Injectable {

  val graphStore = inject[GraphStoreProtocol]
  val internalEndpoint = play.api.Play.configuration.getString("ldvmi.triplestore.push").getOrElse("")
  val componentRepository = inject[ComponentTemplateRepository]
  val dataSourceTemplateRepository = inject[DataSourceTemplateRepository]
  val componentTemplateService = inject[ComponentTemplateService]

  def createDataSourceFromRemoteTtl(urls: Seq[String])(implicit session: Session): Option[DataSourceTemplateId] = {

    urls match {
      case u if u.nonEmpty => withRandomGraphUri { r =>
        val dataSourceName = u.mkString(", ")
        val dataSourceId = createDataSource(dataSourceName, r)

        u.foreach { uri =>
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


  def createDataSourceFromFiles(files: Seq[MultipartFormData.FilePart[Files.TemporaryFile]])(implicit session: Session): Option[DataSourceTemplateId] = {
    files match {
      case f if f.nonEmpty => withRandomGraphUri { r =>
        val dataSourceName = f.map(_.filename).mkString(", ")
        val dataSourceId = createDataSource(dataSourceName, r)

        f.foreach { file =>
          graphStore.pushToTripleStore(file.ref.file, r.graphUri, file.contentType)
        }

        Some(dataSourceId)
      }
      case _ => None
    }
  }

  private def withRandomGraphUri[R](action: RandomGraph => R) = {
    action(new RandomGraph)
  }

  private def config(endpointUrl: String, graphUris: Seq[String]) : Model = {
    val model = ModelFactory.createDefaultModel()

    val configResource = model.createResource()
    configResource.addProperty(RDF.`type`, DSPARQL.SparqlEndpointDataSourceConfiguration)

    val serviceResource = model.createResource()
    val endpointResource = model.createResource(endpointUrl)
    serviceResource.addProperty(SD.endpoint, endpointResource)

    val dataSetResource = model.createResource()
    serviceResource.addProperty(SD.defaultDataset, dataSetResource)

    graphUris.foreach { graphUri =>
      val graphResource = model.createResource(graphUri)
      val namedGraphResource = model.createResource()
      namedGraphResource.addProperty(SD.name, graphResource)
      dataSetResource.addProperty(SD.namedGraph, namedGraphResource)
    }
    configResource.addProperty(DSPARQL.service, serviceResource)

    model
  }

  def createDataSourceFromUris(endpointUrl: String, graphUris: Seq[String])(implicit session: Session): Option[DataSourceTemplateId] = {

    val resourceUri = endpointUrl
    val dataPortTemplate = model.dto.DataPortTemplate(resourceUri+"/output",None,None)
    val outputTemplate = model.dto.OutputTemplate(dataPortTemplate, None)

    val componentTemplate = model.dto.ComponentTemplate(
      resourceUri,
      Some(endpointUrl),
      None,
      Some(config(endpointUrl, graphUris)),
      Seq(),
      Some(outputTemplate),
      Seq(),
      Seq(),
      isTemporary = true
    )

    val savedId = componentTemplateService.save(componentTemplate)

    Some(dataSourceTemplateRepository.save(DataSourceTemplate(None, savedId)))
  }

  private def createDataSource(name: String, randomGraph: RandomGraph)(implicit session: Session): DataSourceTemplateId = {

    val resourceUri = "urn:datasources/" + randomGraph.uuid.toString

    val dataPortTemplate = model.dto.DataPortTemplate(resourceUri+"/output",None,None)
    val outputTemplate = model.dto.OutputTemplate(dataPortTemplate, None)

    val componentTemplate = model.dto.ComponentTemplate(
      resourceUri,
      Some(name),
      None,
      Some(config(internalEndpoint, Seq(randomGraph.graphUri))),
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

class RandomGraph {
  val uuid = UUID.randomUUID()

  def graphUri = "urn:" + uuid.toString
}
