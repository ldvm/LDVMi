package services.data.rdf.sparql.datacube

case class CubeKey(keys: String*)

case class DataCube(dimensionsCount: Int, measuresCount: Int, slices: Map[String, Map[CubeKey, Map[CubeKey, Int]]])