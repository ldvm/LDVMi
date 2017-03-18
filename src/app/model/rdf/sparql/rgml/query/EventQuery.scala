package model.rdf.sparql.rgml.query
import model.rdf.sparql.query.SparqlQuery

class EventQuery extends SparqlQuery{
    def get: String =
      """
        |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        |PREFIX sch: <http://schema.org/>
        |PREFIX dbo: <http://dbpedia.org/ontology/>
        |PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        |
        |SELECT DISTINCT ?event ?eventName ?start ?end ?eventLink WHERE {
        |	?event rdf:type sch:Event ;
        |		foaf:name ?eventName ;
        |		dbo:startDate ?start ;
        |		dbo:endDate  ?end ;
        |		dbo:wikiPageExternalLink ?eventLink .
        |
        |	FILTER EXISTS {
        |   ?event ?relation ?person .
        |   ?person rdf:type sch:Person ;
        |		  foaf:name ?personName ;
        |		  foaf:isPrimaryTopicOf ?personLink .
        |   }
        |} LIMIT 100
      """
        .stripMargin
}
