package model.rdf.sparql.geo

import model.rdf.LocalizedValue

case class WKTEntity(title: Option[LocalizedValue], wkt: String, groupPropertyValue: Option[String])
