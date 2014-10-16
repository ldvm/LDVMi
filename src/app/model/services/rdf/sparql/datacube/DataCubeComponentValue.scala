package model.services.rdf.sparql.datacube

import model.services.rdf.LocalizedValue

case class DataCubeComponentValue(label: Option[LocalizedValue] = None, uri: Option[String] = None, dataType: Option[String] = None)
