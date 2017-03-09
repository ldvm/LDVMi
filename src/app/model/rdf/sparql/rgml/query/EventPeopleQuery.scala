package model.rdf.sparql.rgml.query
import model.rdf.sparql.query.SparqlQuery

class EventPeopleQuery(event: String) extends SparqlQuery {
  def get: String = {
    """
      |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |PREFIX sch: <http://schema.org/>
      |PREFIX dbo: <http://dbpedia.org/ontology/>
      |PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      |
      |SELECT DISTINCT ?person ?personName ?personInfo WHERE {
      |	?event rdf:type sch:Event ;
      | VALUES ?event { <@eventUrl> }
      | ?person rdf:type sch:Person ;
      |		foaf:name ?personName ;
      |		foaf:isPrimaryTopicOf ?personInfo .
      |
      |	FILTER EXISTS { ?event ?relation ?person }
      |}
    """
      .stripMargin
      .replace("@eventUrl", event)
  }
}