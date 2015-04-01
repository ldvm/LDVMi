package model.rdf.sparql.datacube

import model.rdf.LocalizedValue

case class DataCubeComponentValue(label: Option[LocalizedValue] = None, uri: Option[String] = None, dataType: Option[String] = None)
