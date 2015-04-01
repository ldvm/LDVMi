package model.rdf.vocabulary

import com.hp.hpl.jena.rdf.model.Property

object SDMX extends Vocabulary {

  override val PREFIX = "sdmx"
  override val PREFIX_URL = "http://purl.org/linked-data/sdmx#"

  lazy val concept: Property = m.createProperty(PREFIX_URL, "concept")

}
