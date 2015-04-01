package model.rdf.sparql

import com.hp.hpl.jena.query.QueryExecution

trait SparqlEndpoint {

  def queryExecutionFactory(): String => QueryExecution

}
