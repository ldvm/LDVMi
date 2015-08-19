package model.service.impl

import model.entity.{VisualizerTemplate, TransformerTemplate, AnalyzerTemplate, DataSourceTemplate}

case class DiscoveryInput (
  dataSources: Seq[DataSourceTemplate],
  analyzers: Seq[AnalyzerTemplate],
  transformers: Seq[TransformerTemplate],
  visualizers: Seq[VisualizerTemplate],
  fixedDataSource: Option[DataSourceTemplate]
)
