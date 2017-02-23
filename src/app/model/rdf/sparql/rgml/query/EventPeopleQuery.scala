package model.rdf.sparql.rgml.query
import model.rdf.sparql.query.SparqlQuery

class EventPeopleQuery(events: Seq[String]) extends SparqlQuery {
  def get: String = {
    val eventUris = events.map(e => "<" + e + ">").mkString(" ")
    """
      |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |PREFIX sch: <http://schema.org/>
      |PREFIX dbo: <http://dbpedia.org/ontology/>
      |PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      |
      |SELECT DISTINCT ?person ?personName ?personInfo ?event WHERE {
      |	?event rdf:type sch:Event ;
      | VALUES ?event { @eventUrls }
      | ?person rdf:type sch:Person ;
      |		foaf:name ?personName ;
      |		foaf:isPrimaryTopicOf ?personInfo .
      |
      |	FILTER EXISTS { ?event ?relation ?person }
      |}
    """
      .stripMargin
      .replace("@eventUrls", eventUris)
  }
}