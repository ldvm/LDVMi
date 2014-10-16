package model.services.rdf.sparql

package object datacube {
  type MeasuresByKey = Map[String, Option[Float]]
  type SlicesByKey = Map[String, MeasuresByKey]
}
