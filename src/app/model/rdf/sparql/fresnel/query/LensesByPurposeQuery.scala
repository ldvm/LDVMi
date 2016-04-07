package model.rdf.sparql.fresnel.query

import model.rdf.sparql.query.SparqlQuery

class LensesByPurposeQuery(val purpose: String, val isUri: Boolean = false) extends SparqlQuery {

  def get: String =
    """
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      | PREFIX fresnel:  <http://www.w3.org/2004/09/fresnel#>
      |
      | SELECT ?uri ?purpose ?domain ?showProperty
      | WHERE {
      |   ?uri rdf:type fresnel:Lens ;
      |     fresnel:purpose ?purpose ;
      |     fresnel:classLensDomain ?domain ;
      |     fresnel:showProperties ?properties .
      |
      |   ?properties rdf:rest*/rdf:first ?showProperty .
      |
      |   FILTER(?purpose = @s)
      | }
      | GROUP BY ?uri ?purpose ?domain ?showProperty
    """
      .stripMargin.replace("@s", if (isUri) "<" + purpose + ">" else "\"" + purpose + "\"")

}
