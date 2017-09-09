package model.rdf.sparql.geo.models

import model.rdf.LocalizedValue

case class WKTEntity(title: Option[LocalizedValue], wkt: String, groupPropertyValue: Option[String])
