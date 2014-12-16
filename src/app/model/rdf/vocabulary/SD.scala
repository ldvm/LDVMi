package model.rdf.vocabulary

import com.hp.hpl.jena.rdf.model.{Resource, Property}

object SD extends Vocabulary {
  override val PREFIX = "sd"
  override val PREFIX_URL = "http://www.w3.org/ns/sparql-service-description#"

  lazy val endpoint: Property = m.createProperty(PREFIX_URL, "endpoint")
  lazy val defaultDataset: Property = m.createProperty(PREFIX_URL, "defaultDataset")
  lazy val namedGraph: Property = m.createProperty(PREFIX_URL, "namedGraph")
  lazy val name: Property = m.createProperty(PREFIX_URL, "name")


  lazy val Dataset: Resource = m.createResource(PREFIX_URL+"Dataset")
  lazy val NamedGraph: Resource = m.createResource(PREFIX_URL+"NamedGraph")
}
