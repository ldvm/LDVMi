package model.rdf.sparql.fresnel.query

import model.rdf.sparql.fresnel.Lens
import model.rdf.sparql.query.SparqlQuery

class ResourcesThroughLensQuery(lens: Lens) extends SparqlQuery {

  def get: String = {
    val properties = lens.showProperties.zipWithIndex.map { case(property, index) =>
      "?resource <" + property + "> ?property" + index + " ." }

    """
		  | PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      |
      | CONSTRUCT {
      |	  ?resource	rdf:type <@d> .
      |   @c
      |	}
      |	WHERE {
      |   ?resource rdf:type <@d> .
      |   @p
      |	}
    """
      .stripMargin
      .replace("@d", lens.domain)
      .replace("@c", properties mkString "\n")
      .replace("@p", properties.map { p => "OPTIONAL { " + p + " }"} mkString "\n")
  }
}
