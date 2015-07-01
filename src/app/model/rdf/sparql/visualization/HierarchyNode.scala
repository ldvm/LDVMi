package model.rdf.sparql.visualization

case class HierarchyNode(name: String, uri: String, size: Option[Int] = None, children: Option[Seq[HierarchyNode]] = None)
