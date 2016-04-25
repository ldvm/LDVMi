package model.rdf.vocabulary

import org.apache.jena.rdf.model.{Property, Resource}

object CHORD extends Vocabulary {

  override val PREFIX = "chord"
  override val PREFIX_URL = "http://linked.opendata.cz/ontology/chord/"

  lazy val source: Property = m.createProperty(PREFIX_URL, "source")
  lazy val target: Property = m.createProperty(PREFIX_URL, "target")
}
