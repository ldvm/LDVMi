package model.dto

import model.entity.ComponentInstanceId

case class BoundComponentInstances(componentInstances: Seq[ConcreteComponentInstance], uri: Option[String] = None, title: Option[String] = None) {

  type UriToInstanceId = Map[String, ComponentInstanceId]
  type InstanceIdToPortInstances[T] = Seq[(ComponentInstanceId, T)]

  def outputInstancesWithComponentIds: (UriToInstanceId => InstanceIdToPortInstances[OutputInstance]) = { uriToInstanceId =>
    componentInstances.map { componentInstance =>
      val maybeComponentInstanceId = uriToInstanceId.get(componentInstance.componentInstance.uri)
      maybeComponentInstanceId.map { componentInstanceId =>
        (componentInstanceId, componentInstance.componentInstance.outputInstance)
      }
    }.collect {
      case Some((cid, Some(oi))) => (cid, oi)
    }
  }


  def inputInstancesWithComponentIds: (UriToInstanceId => InstanceIdToPortInstances[Seq[InputInstance]]) = { uriToInstanceId =>
    componentInstances.flatMap { componentInstance =>
      val maybeComponentInstanceId = uriToInstanceId.get(componentInstance.componentInstance.uri)
      maybeComponentInstanceId.map { componentInstanceId =>
        (componentInstanceId, componentInstance.componentInstance.inputInstances)
      }
    }
  }

}
