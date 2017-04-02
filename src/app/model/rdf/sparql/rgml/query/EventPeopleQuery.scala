package model.rdf.sparql.rgml.query
import model.rdf.sparql.query.SparqlQuery

class EventPeopleQuery(event: String) extends SparqlQuery {
  def get: String = {
    """
      |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |PREFIX sch: <http://schema.org/>
      |PREFIX dbo: <http://dbpedia.org/ontology/>
      |PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      |PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      |
      |PREFIX dbp: <http://dbpedia.org/property/>
      |SELECT ?person (SAMPLE(?personName) AS ?name) (SAMPLE(?personDescription) AS ?description) (SAMPLE(?personLink) AS ?link) (SAMPLE(?personImage) AS ?image)
      |WHERE {
      | ?person rdf:type sch:Person ;
      |   foaf:name ?personName.
      |
      |  OPTIONAL {?person foaf:isPrimaryTopicOf ?personLink}
      |  OPTIONAL {?person dbp:shortDescription ?personDescription}
      |  OPTIONAL {?person foaf:depiction ?personImage}
      |
      |  <@event> ?relation ?person.
      |}
      |GROUP BY ?person
    """
      .stripMargin
      .replace("@event", event)
  }
}