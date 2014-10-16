package model.services.rdf.vocabulary

import com.hp.hpl.jena.rdf.model.Property

object QB extends Vocabulary {
  override val PREFIX = "qb"
  override val PREFIX_URL = "http://purl.org/linked-data/cube#"

  lazy val dataStructureDefinition: Property = m.createProperty(PREFIX_URL, "DataStructureDefinition")
  lazy val dataset: Property = m.createProperty(PREFIX_URL, "DataSet")
  lazy val component: Property = m.createProperty(PREFIX_URL, "component")
  lazy val dimension: Property = m.createProperty(PREFIX_URL, "dimension")
  lazy val attribute: Property = m.createProperty(PREFIX_URL, "attribute")
  lazy val measure: Property = m.createProperty(PREFIX_URL, "measure")
  lazy val order: Property = m.createProperty(PREFIX_URL, "order")
  lazy val concept: Property = m.createProperty(PREFIX_URL, "concept")

}
