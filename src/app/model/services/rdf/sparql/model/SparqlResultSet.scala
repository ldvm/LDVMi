package model.services.rdf.sparql.model

case class SparqlResultSet(variables: Seq[String], solutions: Seq[SparqlResultSolution])