package model.rdf.sparql.datacube

import model.rdf.sparql.ValueFilter

case class DataCubeKey(dimensionUriKeys: Map[String, String], dimensionLiteralKeys: Map[String,String], dimensionLiteralTypes: Map[String,Option[String]], measureUris: Seq[String])

case class DataCubeCell(key: DataCubeKey, measureValues: Map[String, Option[Float]])

case class DataCube(cells: Seq[DataCubeCell], slices: Option[SlicesByKey] = None)

object DataCubeKey {
  def create(rules: Seq[(String, ValueFilter)], measureUris: Seq[String]): DataCubeKey = {
    val partitions = rules.partition(_._2.uri.isDefined)
    val uriKeys = partitions._1.map(k => (k._1, k._2.uri.get)).toMap
    val literalKeys = partitions._2.filter(_._2.label.isDefined).map(k => (k._1, k._2.label.get)).toMap
    val literalTypes = partitions._2.filter(_._2.label.isDefined).map(k => (k._1, k._2.dataType)).toMap

    new DataCubeKey(uriKeys, literalKeys, literalTypes, measureUris)
  }
}