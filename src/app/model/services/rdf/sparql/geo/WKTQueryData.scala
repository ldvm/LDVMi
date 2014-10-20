package model.services.rdf.sparql.geo

import model.services.rdf.sparql.ValueFilter

case class WKTQueryData(filters: Map[String,Seq[ValueFilter]])
