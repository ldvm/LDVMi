package model.rdf.extractor

import com.hp.hpl.jena.query.QueryExecution
import model.rdf.sparql.query.SparqlQuery

trait QueryExecutionResultExtractor[Q <: SparqlQuery, R] extends ResultExtractor[Q, QueryExecution, R] {

}
