package model.rdf.sparql.visualization

import model.rdf.LocalizedValue

case class Concept(uri: String, label: Option[LocalizedValue], description: Option[LocalizedValue], schemeUri: Option[String], linkUris: Seq[String])
case class Scheme(uri: String, label: Option[LocalizedValue], description: Option[LocalizedValue])