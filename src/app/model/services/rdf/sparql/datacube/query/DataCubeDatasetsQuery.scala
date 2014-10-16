package model.services.rdf.sparql.datacube.query

import model.services.rdf.sparql.query.SparqlQuery


class DataCubeDatasetsQuery extends SparqlQuery {

  def get: String =
    """
      | PREFIX qb:       <http://purl.org/linked-data/cube#>
      | PREFIX rdf:      <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      | PREFIX rdfs:     <http://www.w3.org/2000/01/rdf-schema#>
      | PREFIX xsd:      <http://www.w3.org/2001/XMLSchema#>
      | PREFIX dct:      <http://purl.org/dc/terms/>
      |
      | CONSTRUCT {
      |   ?ds a qb:DataSet ;
      |       dct:title ?title ;
      |       rdfs:label ?label ;
      |       rdfs:comment ?comment ;
      |       dct:description ?description ;
      |       dct:publisher ?publisher ;
      |       dct:issued ?issued .
      | } WHERE {
      |   ?ds a qb:DataSet .
      |
      |   OPTIONAL {
      |    ?ds dct:title ?title .
      |   }
      |   OPTIONAL {
      |    ?ds rdfs:label ?label .
      |   }
      |   OPTIONAL {
      |    ?ds rdfs:comment ?comment .
      |   }
      |   OPTIONAL {
      |    ?ds dct:description ?description .
      |   }
      |   OPTIONAL {
      |    ?ds dct:publisher ?publisher .
      |   }
      |   OPTIONAL {
      |    ?ds dct:issued ?issued .
      |   }
      | }
    """.stripMargin.replaceAll("[\n\r]","")

}
