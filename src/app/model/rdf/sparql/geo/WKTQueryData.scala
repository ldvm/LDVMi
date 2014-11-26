package model.rdf.sparql.geo

import model.rdf.sparql.ValueFilter

case class WKTQueryData(filters: Map[String,Seq[ValueFilter]])
