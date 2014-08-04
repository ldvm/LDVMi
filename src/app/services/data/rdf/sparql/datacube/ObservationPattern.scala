package services.data.rdf.sparql.datacube

import services.data.rdf.sparql.Pattern

class ObservationPattern(dimensionUriKeys: Map[String, String], dimensionLiteralKeys: Map[String, String], measureUris: Seq[String]) extends Pattern {
  override def getSPARQLPattern: String =
    "?o a qb:Observation ; \n" + rulesPatterns.mkString(";\n") + " .\n"

  private def rulesPatterns: Seq[String] = {
    var i = 0
    (dimensionUriKeys.map { case (dimensionUri, valueUri) =>
      "    <" + dimensionUri + ">    <" + valueUri + ">"

    } ++ dimensionLiteralKeys.map { case (dimensionUri, value) =>
      "    <" + dimensionUri + ">    \"" + value.toString + "\""
    } ++ measureUris.map { uri =>
      i += 1
      "    <" + uri + ">   ?m" + i
    }).toSeq
  }

}

object ObservationPattern {
  def apply(key: DataCubeKey): ObservationPattern = {
    new ObservationPattern(key.dimensionUriKeys, key.dimensionLiteralKeys, key.measureUris)
  }
}
