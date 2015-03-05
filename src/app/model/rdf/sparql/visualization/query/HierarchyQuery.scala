package model.rdf.sparql.visualization.query

import model.rdf.sparql.query.SparqlQuery

class HierarchyQuery extends SparqlQuery {

  def get: String =
    """
      | PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      | PREFIX ec: <http://ec.europa.eu/eurostat/ramon/ontologies/geographic.rdf#>
      | PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      | PREFIX s: <http://schema.org/>
      | construct {
      |   ?ca a skos:Concept;
      |      skos:prefLabel ?name;
      |      rdf:value ?size;
      |      skos:broader ?broader.
      |}
      |where
      |{
      |   ?ca a skos:Concept;
      |      skos:prefLabel ?name;
      |      rdf:value ?size;
      |      skos:broader ?broader.
      |}
    """.stripMargin

}
