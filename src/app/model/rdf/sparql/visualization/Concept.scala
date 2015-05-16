package model.rdf.sparql.visualization

import model.rdf.LocalizedValue

case class Concept(uri: String, label: Option[LocalizedValue], description: Option[LocalizedValue])