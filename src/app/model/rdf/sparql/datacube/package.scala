package model.rdf.sparql

package object datacube {
  type MeasuresByKey = Map[String, Option[BigDecimal]]
  type SlicesByKey = Map[String, MeasuresByKey]
}
