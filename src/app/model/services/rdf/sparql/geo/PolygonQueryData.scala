package model.services.rdf.sparql.geo

import model.services.rdf.sparql.ValueFilter

case class PolygonQueryData(filters: Map[String,Seq[ValueFilter]])
