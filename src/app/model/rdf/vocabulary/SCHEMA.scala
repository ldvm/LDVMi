package model.rdf.vocabulary

import org.apache.jena.rdf.model.Resource

object SCHEMA extends Vocabulary {

  override val PREFIX = "schema"
  override val PREFIX_URL = "http://schema.org/"

  lazy val Event: Resource = m.createResource(PREFIX_URL + "Event")
  lazy val Person: Resource = m.createResource(PREFIX_URL + "Person")
}
