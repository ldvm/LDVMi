package model.rdf.sparql


import _root_.model.rdf.Graph
import _root_.model.rdf.vocabulary.{DSPARQL, SD}
import com.hp.hpl.jena.query.{QueryExecution, QueryExecutionFactory}

import scala.collection.JavaConversions._

class GenericSparqlEndpoint(val endpointURL: String, val namedGraphs: Seq[String] = List()) extends SparqlEndpoint {

  def queryExecutionFactory(): String => QueryExecution = { query =>
    QueryExecutionFactory.sparqlService(endpointURL, query, namedGraphs, List())
  }

}

object GenericSparqlEndpoint {
  def apply(instanceConfiguration: Option[Graph], configuration: Option[Graph]): Option[GenericSparqlEndpoint] = {

    getEndpointUrl(Seq(instanceConfiguration, configuration)).map { endpointUrl =>
      new GenericSparqlEndpoint(endpointUrl, getNamedGraphs(Seq(instanceConfiguration, configuration)))
    }
  }

  private def getEndpointUrl(configurations: Seq[Option[Graph]]): Option[String] = {

    configurations.filter(_.isDefined).map(_.get.jenaModel).map { configurationModel =>
      val serviceStatements = configurationModel.listStatements(null, DSPARQL.service, null).toList
      serviceStatements.map { serviceStatement =>
        serviceStatement.getObject.asResource().listProperties(SD.endpoint).toList.headOption.map(_.getObject.asResource().getURI)
      }.filter(_.isDefined).map(_.get).head
    }.headOption

  }

  private def getNamedGraphs(configurations: Seq[Option[Graph]]): Seq[String] = {

    val namedGraphUris = configurations.filter(_.isDefined).map(_.get.jenaModel).map { configurationModel =>
      val serviceStatements = configurationModel.listStatements(null, DSPARQL.service, null).toList
      serviceStatements.map { serviceStatement =>
        val datasetStatements = serviceStatement.getObject.asResource().listProperties(SD.defaultDataset).toList
        datasetStatements.map { datasetStatement =>
          val namedGraphsStatements = datasetStatement.getObject.asResource().listProperties(SD.namedGraph).toList
          namedGraphsStatements.map { namedGraphsStatement =>
            namedGraphsStatement.getProperty(SD.name).getObject.asResource().getURI
          }
        }
      }
    }

    namedGraphUris.flatten.flatten.flatten

  }
}

