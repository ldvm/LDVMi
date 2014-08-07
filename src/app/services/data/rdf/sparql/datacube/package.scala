package services.data.rdf.sparql

package object datacube {
  type MeasuresByKey = Map[String, Option[Int]]
  type SlicesByKey = Map[String, MeasuresByKey]
}
