package model.rdf.vocabulary

import com.hp.hpl.jena.rdf.model.Property

object GeoSPARQL extends Vocabulary {
  override val PREFIX = "res"
  override val PREFIX_URL = "http://www.opengis.net/ont/geosparql#"

  lazy val asWKT: Property = m.createProperty(PREFIX_URL, "asWKT")
  lazy val hasGeometry: Property = m.createProperty(PREFIX_URL, "hasGeometry")
}
