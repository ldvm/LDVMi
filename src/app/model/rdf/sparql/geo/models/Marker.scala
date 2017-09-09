package model.rdf.sparql.geo.models

case class Marker(uri: String, coordinates: Coordinates, title: Option[String] = None, description: Option[String] = None)
case class Coordinates(lat: Float, lng: Float)
