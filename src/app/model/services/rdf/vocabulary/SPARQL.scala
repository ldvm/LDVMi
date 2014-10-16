package model.services.rdf.vocabulary

import com.hp.hpl.jena.rdf.model.{RDFNode, Property}

object SPARQL extends Vocabulary {

  override val PREFIX = "res"
  override val PREFIX_URL = "http://www.w3.org/2005/sparql-results#"

  lazy val solution: Property = m.createProperty(PREFIX_URL, "solution")
  lazy val binding: Property = m.createProperty(PREFIX_URL, "binding")
  lazy val resultVariable: Property = m.createProperty(PREFIX_URL, "resultVariable")
  lazy val variable: Property = m.createProperty(PREFIX_URL, "variable")
  lazy val value: Property = m.createProperty(PREFIX_URL, "value")

  lazy val resultSet: RDFNode = m.createResource(PREFIX_URL + "ResultSet")


}
