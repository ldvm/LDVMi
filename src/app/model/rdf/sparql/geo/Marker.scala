package model.rdf.sparql.geo

case class Coordinates(lat: Float, lng: Float)
case class Marker(uri: String, coordinates: Coordinates, title: Option[String] = None, description: Option[String] = None)
