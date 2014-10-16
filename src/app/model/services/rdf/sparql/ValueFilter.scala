package model.services.rdf.sparql

case class ValueFilter(label: Option[String] = None, dataType: Option[String], uri: Option[String] = None, isActive: Option[Boolean] = Some(false))