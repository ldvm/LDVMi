package model.rdf.vocabulary

import org.apache.jena.rdf.model.{Property, Resource}

object RGML extends Vocabulary {

  override val PREFIX = "rgml"
  override val PREFIX_URL = "http://purl.org/puninj/2001/05/rgml-schema#"

  lazy val directed: Property = m.createProperty(PREFIX_URL, "directed")
  lazy val source: Property = m.createProperty(PREFIX_URL, "source")
  lazy val target: Property = m.createProperty(PREFIX_URL, "target")
  lazy val weight: Property = m.createProperty(PREFIX_URL, "weight")

  lazy val Graph: Resource = m.createResource(PREFIX_URL + "Graph")
  lazy val Node: Resource = m.createResource(PREFIX_URL + "Node")
  lazy val Edge: Resource = m.createResource(PREFIX_URL + "Edge")
}
