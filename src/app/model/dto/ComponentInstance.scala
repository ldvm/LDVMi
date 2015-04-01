package model.dto

import com.hp.hpl.jena.rdf.model.Model

case class ComponentInstance(
  uri: String,
  templateUri: String,
  label: Option[String],
  inputInstances: Seq[InputInstance],
  outputInstance: Option[OutputInstance],
  configuration: Option[Model]
  )

trait ConcreteComponentInstance {
  def componentInstance: ComponentInstance
}

case class VisualizerInstance(componentInstance: ComponentInstance) extends ConcreteComponentInstance
case class AnalyzerInstance(componentInstance: ComponentInstance) extends ConcreteComponentInstance
case class TransformerInstance(componentInstance: ComponentInstance) extends ConcreteComponentInstance
case class DataSourceInstance(componentInstance: ComponentInstance) extends ConcreteComponentInstance