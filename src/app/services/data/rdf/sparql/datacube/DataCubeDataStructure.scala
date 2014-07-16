package services.data.rdf.sparql.datacube

import services.data.rdf.{LabeledNode, LocalizedLiteral}

case class DataCubeDataStructure(uri: String, components: Seq[DataCubeComponent] = List(), title: Option[LocalizedLiteral] = None, label: Option[LocalizedLiteral] = None, comment: Option[LocalizedLiteral] = None, description: Option[LocalizedLiteral] = None, prefLabel: Option[LocalizedLiteral] = None) extends LabeledNode

case class DataCubeComponent(uri: String, dimension: Option[DataCubeDimensionProperty], measure: Option[DataCubeMeasureProperty], attribute: Option[DataCubeAttributeProperty], order: Option[Int] = None, title: Option[LocalizedLiteral] = None, label: Option[LocalizedLiteral] = None, comment: Option[LocalizedLiteral] = None, description: Option[LocalizedLiteral] = None, prefLabel: Option[LocalizedLiteral] = None) extends LabeledNode

case class DataCubeDimensionProperty(uri: String, conceptUri: Option[String] = None, title: Option[LocalizedLiteral] = None, label: Option[LocalizedLiteral] = None, comment: Option[LocalizedLiteral] = None, description: Option[LocalizedLiteral] = None, prefLabel: Option[LocalizedLiteral] = None) extends LabeledNode

case class DataCubeAttributeProperty(uri: String, conceptUri: Option[String] = None, title: Option[LocalizedLiteral] = None, label: Option[LocalizedLiteral] = None, comment: Option[LocalizedLiteral] = None, description: Option[LocalizedLiteral] = None, prefLabel: Option[LocalizedLiteral] = None) extends LabeledNode

case class DataCubeMeasureProperty(uri: String, conceptUri: Option[String] = None, rangeUri: Option[String] = None, title: Option[LocalizedLiteral] = None, label: Option[LocalizedLiteral] = None, comment: Option[LocalizedLiteral] = None, description: Option[LocalizedLiteral] = None, prefLabel: Option[LocalizedLiteral] = None) extends LabeledNode