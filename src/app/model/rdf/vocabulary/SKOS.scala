package model.rdf.vocabulary

import com.hp.hpl.jena.rdf.model.{Resource, Property}

object SKOS extends Vocabulary {

  override val PREFIX = "skos"
  override val PREFIX_URL = "http://www.w3.org/2004/02/skos/core#"

  lazy val prefLabel: Property = m.createProperty(PREFIX_URL, "prefLabel")
  lazy val inScheme: Property = m.createProperty(PREFIX_URL, "inScheme")
  lazy val broader: Property = m.createProperty(PREFIX_URL, "broader")
  lazy val narrower: Property = m.createProperty(PREFIX_URL, "narrower")
  lazy val broaderTransitive: Property = m.createProperty(PREFIX_URL, "broaderTransitive")
  lazy val narrowerTransitive: Property = m.createProperty(PREFIX_URL, "narrowerTransitive")
  lazy val Concept: Resource = m.createResource(PREFIX_URL + "Concept")
  lazy val ConceptScheme: Resource = m.createResource(PREFIX_URL + "ConceptScheme")

}
