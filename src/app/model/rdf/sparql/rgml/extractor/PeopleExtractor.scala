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
      Some(resList.map(p => {
        var description = if (p.contains("description")) p.getLiteral("description").getString else "no_description"
        var image = if (p.contains("image")) p.getResource("image").getURI else "no_image"
        var link = if (p.contains("link")) p.getResource("link").getURI else "no_link"

        new Person(
          p.getResource("person").getURI,
          p.getLiteral("name").getString,
          description,
          image,
          link
        )
      }
      ))
    }
    catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
