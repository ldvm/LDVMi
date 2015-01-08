package model.service

import model.entity.ComponentInstance

case class PortMapping(sourceComponentInstance: ComponentInstance, targetComponentInstance: ComponentInstance, viaPortUri: String) {
  override def toString = sourceComponentInstance.toString + "<-" + targetComponentInstance.toString
}

case class PartialPipeline(componentInstances: Seq[ComponentInstance], portMappings: Seq[PortMapping], notUsed : Boolean = true) {
  override def toString =
    """
      components: """ + componentInstances.toString() +
      """
      portMappings: """ + portMappings.toString()
}
