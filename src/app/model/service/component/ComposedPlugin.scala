package model.service.component

import scala.concurrent.Future

class ComposedPlugin(internalComponent: InternalComponent) extends AnalyzerPlugin {
  override def run(inputs: Seq[DataReference]): Future[(String, Option[String])] = ???
}
