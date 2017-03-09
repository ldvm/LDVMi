package model.rdf.sparql.rgml.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.Person
import model.rdf.sparql.rgml.query.EventPeopleQuery
import org.apache.jena.query.QueryExecution
import scala.collection.JavaConversions._


class PersonExtractor extends QueryExecutionResultExtractor[EventPeopleQuery, Seq[Person]]{
  def extract(input: QueryExecution): Option[Seq[Person]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(e => Person(
        e.getLiteral("person").getString(),
        e.getLiteral("personName").getString(),
        e.getLiteral("personInfo").getString())
      ))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
