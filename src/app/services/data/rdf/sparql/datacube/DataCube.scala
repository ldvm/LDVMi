package services.data.rdf.sparql.datacube

case class DataCubeKey(dimensionUriKeys: Map[String, String], dimensionLiteralKeys: Map[String, String], measureUris: Seq[String])

case class DataCubeCell(key: DataCubeKey, measureValues: Map[String, Option[Float]])

case class DataCube(cells: Seq[DataCubeCell], slices: Option[SlicesByKey] = None)

object DataCubeKey {
  def create(rules: Seq[(String, DataCubeQueryValueFilter)], measureUris: Seq[String]): DataCubeKey = {
    val partitions = rules.partition(_._2.uri.isDefined)
    val uriKeys = partitions._1.map(k => (k._1, k._2.uri.get)).toMap
    val literalKeys = partitions._2.filter(_._2.label.isDefined).map(k => (k._1, k._2.label.get)).toMap

    new DataCubeKey(uriKeys, literalKeys, measureUris)
  }
}