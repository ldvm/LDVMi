package model.rdf.sparql.visualization

import model.rdf.LocalizedValue

case class HierarchyNode(name: LocalizedValue, uri: String, size: Option[Int] = None, children: Option[Seq[HierarchyNode]] = None)
