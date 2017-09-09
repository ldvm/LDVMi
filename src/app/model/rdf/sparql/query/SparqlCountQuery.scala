package model.rdf.sparql.query

trait SparqlCountQuery extends SparqlQuery{
  def getCount : String
}
