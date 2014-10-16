package model.services.rdf.sparql.jena

import org.apache.jena.riot.Lang


class JenaLangRdfXml extends JenaLang {
  def get: Lang = Lang.RDFXML

  override def acceptType: String = "application/rdf+xml"
}
