package model.rdf.vocabulary

object QB extends Vocabulary {

  override val PREFIX = "qb"
  override val PREFIX_URL = "http://purl.org/linked-data/cube#"

  lazy val dataStructureDefinition = m.createResource(PREFIX_URL + "DataStructureDefinition")
  lazy val dataset = m.createResource(PREFIX_URL + "DataSet")
  lazy val component = m.createProperty(PREFIX_URL, "component")
  lazy val dimension = m.createProperty(PREFIX_URL, "dimension")
  lazy val attribute = m.createProperty(PREFIX_URL, "attribute")
  lazy val measure = m.createProperty(PREFIX_URL, "measure")
  lazy val order = m.createProperty(PREFIX_URL, "order")
  lazy val concept = m.createProperty(PREFIX_URL, "concept")

}
