package model.rdf.sparql.datacube

import model.rdf.sparql.Pattern

class ObservationPattern(dimensionUriKeys: Map[String, String], dimensionLiteralKeys: Map[String, String], dimensionLiteralTypes: Map[String, Option[String]], measureUris: Seq[String]) extends Pattern {

  private val statementSeparator = " ; \n"
  private val blockSeparator = " . \n"
  private val observationPattern = "?o a qb:Observation " + statementSeparator

  override def getConstructPattern: String = {
    getPattern(isWhere = false)
  }


  override def getWherePattern: String = {
    getPattern(isWhere = true)
  }

  private def getPattern(isWhere: Boolean = false): String ={
    observationPattern + dimensionsPattern + dimensionLiterals + blockSeparator + measuresPattern(isWhere) + blockSeparator
  }

  private def dimensionsPattern: String = {
    dimensionUriKeys.map { case (dimensionUri, valueUri) =>
      "    <" + dimensionUri + ">    <" + valueUri + ">"

    }.mkString(statementSeparator)
  }

  private def dimensionLiterals: String = {
    dimensionLiteralKeys.map { case (dimensionUri, value) =>
      "    <" + dimensionUri + ">    \"" + value.toString + "\"" + dimensionLiteralTypes(dimensionUri).map("^^<" + _ + ">").getOrElse("")
    }.mkString(statementSeparator)
  }

  private def measuresPattern(isWhere: Boolean = false): String = {
    var i = 0
    if (isWhere) {
      measureUris.map { uri =>
        i += 1
        " OPTIONAL { ?o <" + uri + ">   ?m" + i + " } "
      }.mkString("\n")
    } else {
      measureUris.map { uri =>
        i += 1
        " ?o <" + uri + ">   ?m" + i
      }.mkString(blockSeparator)
    }
  }

}

object ObservationPattern {
  def apply(key: DataCubeKey): ObservationPattern = {
    new ObservationPattern(key.dimensionUriKeys, key.dimensionLiteralKeys, key.dimensionLiteralTypes, key.measureUris)
  }
}
