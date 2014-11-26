package model.rdf.sparql


import _root_.model.entity.DataSourceEagerBox
import com.hp.hpl.jena.query.{QueryExecution, QueryExecutionFactory}

import scala.collection.JavaConversions._

class GenericSparqlEndpoint(val endpointURL: String, val namedGraphs: Seq[String] = List()) extends SparqlEndpoint {

  def queryExecutionFactory(): String => QueryExecution = { query =>
    QueryExecutionFactory.sparqlService(endpointURL, query, namedGraphs, List())
  }

}

object GenericSparqlEndpoint {
  def apply(box: DataSourceEagerBox) = {
    val config = box.component.configuration
    val endpointUrl = (config \ "endpointUrl").as[String]
    val namedGraphs = (config \ "namedGraphs").as[Seq[String]]
    new GenericSparqlEndpoint(endpointUrl, namedGraphs)
  }
}

