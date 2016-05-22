package model.rdf.sparql.rgml

import model.rdf.LocalizedValue

case class NodeWithDegree(uri: String, label: Option[LocalizedValue], inDegree: Int, outDegree: Int)
