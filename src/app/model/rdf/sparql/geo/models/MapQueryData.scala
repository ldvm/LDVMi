package model.rdf.sparql.geo.models

import model.rdf.sparql.ValueFilter

case class MapQueryData(filters: Map[String,Seq[ValueFilter]])
