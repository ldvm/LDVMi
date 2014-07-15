package services.data.rdf.sparql.datacube

import services.data.rdf.LocalizedLiteral

case class DataCubeDataStructure(uri: String, components: Seq[DataCubeComponent] = List(), title: Option[LocalizedLiteral] = None, label: Option[LocalizedLiteral] = None, comment: Option[LocalizedLiteral] = None, description: Option[LocalizedLiteral] = None)

case class DataCubeComponent(uri: String, dimension: Option[DataCubeDimensionProperty], measure: Option[DataCubeMeasureProperty], attribute: Option[DataCubeAttributeProperty], order: Option[Int] = None, label: Option[String] = None)
case class DataCubeDimensionProperty(uri: String, conceptUri: Option[String], title: Option[String] = None, label: Option[String] = None, comment: Option[String] = None, description: Option[String] = None)
case class DataCubeAttributeProperty(uri: String, conceptUri: Option[String], title: Option[String] = None, label: Option[String] = None, comment: Option[String] = None, description: Option[String] = None)
case class DataCubeMeasureProperty(uri: String, conceptUri: Option[String], rangeUri: Option[String], title: Option[String] = None, label: Option[String] = None, comment: Option[String] = None, description: Option[String] = None)