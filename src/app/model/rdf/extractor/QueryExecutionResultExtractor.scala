package model.rdf.extractor

import model.rdf.sparql.query.SparqlQuery
import org.apache.jena.query.QueryExecution

trait QueryExecutionResultExtractor[Q <: SparqlQuery, R] extends ResultExtractor[Q, QueryExecution, R] {

}
