package model.rdf.sparql

package object datacube {
  type MeasuresByKey = Map[String, Option[Long]]
  type SlicesByKey = Map[String, MeasuresByKey]
}
