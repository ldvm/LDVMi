package model.service.impl

import model.entity._

case class DiscoveryInput (
  dataSources: Seq[DataSourceTemplate],
  analyzers: Seq[AnalyzerTemplate],
  transformers: Seq[TransformerTemplate],
  visualizers: Seq[VisualizerTemplate],
  fixedDataSource: Option[DataSourceTemplate]
) {

  def all : Seq[SpecificComponentTemplate] = dataSources ++ analyzers ++ transformers ++ visualizers

  def withoutTransformers: Seq[SpecificComponentTemplate] = dataSources ++ analyzers ++ visualizers

}
