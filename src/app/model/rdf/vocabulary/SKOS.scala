package model.rdf.vocabulary

import com.hp.hpl.jena.rdf.model.Property

object SKOS extends Vocabulary {

  override val PREFIX = "skos"
  override val PREFIX_URL = "http://www.w3.org/2004/02/skos/core#"

  lazy val prefLabel: Property = m.createProperty(PREFIX_URL, "prefLabel")

}
