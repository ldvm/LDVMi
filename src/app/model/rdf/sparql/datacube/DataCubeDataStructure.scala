package model.rdf.sparql.datacube

import model.rdf.{LabeledNode, LocalizedValue}

case class DataCubeDataStructure(uri: String, components: Seq[DataCubeComponent] = List(), title: Option[LocalizedValue] = None, label: Option[LocalizedValue] = None, comment: Option[LocalizedValue] = None, description: Option[LocalizedValue] = None, prefLabel: Option[LocalizedValue] = None) extends LabeledNode

case class DataCubeComponent(uri: String, dimension: Option[DataCubeDimensionProperty], measure: Option[DataCubeMeasureProperty], attribute: Option[DataCubeAttributeProperty], order: Option[Int] = None, title: Option[LocalizedValue] = None, label: Option[LocalizedValue] = None, comment: Option[LocalizedValue] = None, description: Option[LocalizedValue] = None, prefLabel: Option[LocalizedValue] = None) extends LabeledNode

case class DataCubeDimensionProperty(uri: String, conceptUri: Option[String] = None, title: Option[LocalizedValue] = None, label: Option[LocalizedValue] = None, comment: Option[LocalizedValue] = None, description: Option[LocalizedValue] = None, prefLabel: Option[LocalizedValue] = None) extends LabeledNode

case class DataCubeAttributeProperty(uri: String, conceptUri: Option[String] = None, title: Option[LocalizedValue] = None, label: Option[LocalizedValue] = None, comment: Option[LocalizedValue] = None, description: Option[LocalizedValue] = None, prefLabel: Option[LocalizedValue] = None) extends LabeledNode

case class DataCubeMeasureProperty(uri: String, conceptUri: Option[String] = None, rangeUri: Option[String] = None, title: Option[LocalizedValue] = None, label: Option[LocalizedValue] = None, comment: Option[LocalizedValue] = None, description: Option[LocalizedValue] = None, prefLabel: Option[LocalizedValue] = None) extends LabeledNode