package model.rdf.sparql.visualization

case class HierarchyNode(name: String, size: Option[Int] = None, children: Option[Seq[HierarchyNode]] = None)
