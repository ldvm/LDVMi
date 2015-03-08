package model.rdf.sparql.geo

case class Marker(uri: String, lat: Float, lng: Float, title: Option[String] = None, description: Option[String] = None)
