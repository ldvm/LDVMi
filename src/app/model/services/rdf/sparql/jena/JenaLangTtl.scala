package model.services.rdf.sparql.jena

import org.apache.jena.riot.Lang


class JenaLangTtl extends JenaLang {
  def get: Lang = Lang.TTL

  override def acceptType: String = "text/turtle"
}
