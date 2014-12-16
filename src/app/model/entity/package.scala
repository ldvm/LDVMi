package model

import scala.slick.lifted.TableQuery

package object entity {

  val componentsQuery = TableQuery[ComponentTable]
  val analyzersQuery = TableQuery[AnalyzerTable]
  val transformersQuery = TableQuery[TransformerTable]
  val visualizersQuery = TableQuery[VisualizerTable]
  val dataSourcesQuery = TableQuery[DataSourceTable]

  val componentFeaturesQuery = TableQuery[FeatureToComponentTable]
  val featuresQuery = TableQuery[FeatureTable]
  val bindingSetsQuery = TableQuery[DataPortBindingSetTable]
  val bindingsQuery = TableQuery[DataPortBindingTable]

  val dataPortsQuery = TableQuery[DataPortTable]
  val outputsQuery = TableQuery[OutputTable]
  val inputsQuery = TableQuery[InputTable]

  val componentInstancesQuery = TableQuery[ComponentInstanceTable]
  val analyzerInstancesQuery = TableQuery[AnalyzerInstanceTable]
  val transformerInstancesQuery = TableQuery[TransformerInstanceTable]
  val visualizerInstancesQuery = TableQuery[VisualizerInstanceTable]
  val dataSourceInstancesQuery = TableQuery[DataSourceInstanceTable]

  val componentInstanceMembershipQuery = TableQuery[ComponentInstanceMembershipTable]

  val dataPortBindingSetsQuery = TableQuery[DataPortBindingSetTable]
  val dataPortBindingsQuery = TableQuery[DataPortBindingTable]
  val dataPortInstancesQuery = TableQuery[DataPortInstanceTable]
  val inputInstancesQuery = TableQuery[InputInstanceTable]

  val descriptorsQuery = TableQuery[DescriptorTable]

}
