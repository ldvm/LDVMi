package model.rdf.sparql.rgml.query

import java.util.Date
import java.text.SimpleDateFormat
import model.rdf.sparql.query.SparqlQuery

class EventQuery(start: Date, end: Date, limit: Int) extends SparqlQuery{
  val dateFormat = new SimpleDateFormat("YYYY-MM-DD")
  def get: String =
    """
      |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |PREFIX sch: <http://schema.org/>
      |PREFIX dbo: <http://dbpedia.org/ontology/>
      |PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      |PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      |
      |SELECT ?event (SAMPLE(?eventName) AS ?name) (SAMPLE(?eventDate) AS ?date) (SAMPLE(?eventLink) AS ?link)
      |WHERE {
      |    ?event rdf:type sch:Event ;
      |        foaf:name ?eventName ;
      |        dbo:date ?eventDate ;
      |        dbo:wikiPageExternalLink ?eventLink .
      |
      |    FILTER (?eventDate > "@start"^^xsd:date)
      |    FILTER (?eventDate < "@end"^^xsd:date)
      |
      |    FILTER EXISTS {
      |       ?person rdf:type sch:Person.
      |       ?event ?relation ?person.
      |    }
      |}
      |GROUP BY ?event
      |LIMIT @limit
    """
      .replace("@start",dateFormat.format(start))
      .replace("@end",dateFormat.format(end))
      .replace("@limit", limit.toString)
      .stripMargin
}
