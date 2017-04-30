package model.rdf.sparql.rgml.models

import model.rdf.LocalizedValue

case class NodeWithDegree(uri: String, label: Option[LocalizedValue], inDegree: Int, outDegree: Int)
