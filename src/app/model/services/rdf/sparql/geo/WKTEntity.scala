package model.services.rdf.sparql.geo

import model.services.rdf.LocalizedValue

case class WKTEntity(title: Option[LocalizedValue], wkt: String, groupPropertyValue: Option[String])
