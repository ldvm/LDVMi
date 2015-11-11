package model.rdf.sparql

import org.apache.jena.query.QueryExecution

trait SparqlEndpoint {

  def queryExecutionFactory(): String => QueryExecution

}
