package model.rdf.sparql.rgml.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.Person
import model.rdf.sparql.rgml.query.EventPeopleQuery
import org.apache.jena.query.QueryExecution
import scala.collection.JavaConversions._


class PeopleExtractor extends QueryExecutionResultExtractor[EventPeopleQuery, Seq[Person]]{
  def extract(input: QueryExecution): Option[Seq[Person]] = {
    try {
      val resList = input.execSelect().toList
      Some(resList.map(p => new Person(
        p.getResource("person").getURI,
        p.getLiteral("name").getString,
        p.getLiteral("description").getString,
        p.getResource("image").getURI,
        p.getResource("link").getURI)
      ))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
