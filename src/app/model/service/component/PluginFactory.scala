package model.service.component

import model.service.GraphStoreProtocol

class PluginFactory(graphStore: GraphStoreProtocol) {

  def get(internalComponent: InternalComponent, uri: String) : Option[AnalyzerPlugin] = {
    val plugin = uri match {
      case "http://linked.opendata.cz/resource/ldvm/analyzer/sparql/SparqlAnalyzerTemplate" => new SparqlPlugin(internalComponent, graphStore)
      case "http://linked.opendata.cz/resource/ldvm/analyzer/union/UnionAnalyzerTemplate" => new UnionPlugin(internalComponent, graphStore)
      case "http://ldvm.opendata.cz/resource/template/analyzer/ruian/geocoder" => new GeocoderPlugin(internalComponent, graphStore)
      case _ => null
    }

    Option(plugin)
  }

}
