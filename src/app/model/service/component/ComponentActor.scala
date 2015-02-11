package model.service.component

import akka.actor.{Actor, ActorRef, Props}

import scala.collection.mutable
import scala.concurrent.ExecutionContext.Implicits.global

case class BindMessage(portUri: String)

case class DataReference(portUri: String, endpointUri: String, graphUri: Option[String])

case class Failure(reason: String)

case class Run()

object ComponentActor {
  def props(component: InternalComponent) = Props(new ComponentActor(component))
}

class ComponentActor(component: InternalComponent) extends Actor {

  val bindings = new mutable.HashMap[ActorRef, String]
  
  val bindingResponses = new mutable.HashMap[ActorRef, DataReference]

  def setResponse(sender: ActorRef, dataRef: DataReference) = bindingResponses.+=((sender, dataRef))

  def receive = {
    case bind: BindMessage => {
      saveBinding((sender(), bind.portUri))
    }
    case dataReference: DataReference => {
      setResponse(sender(), dataReference)

      if (bindingResponses.keySet == bindings.keySet) {
        val eventualDataReference = component.evaluate(bindingResponses.map(_._2).toSeq)

        eventualDataReference.onSuccess{ case (endpoint, graph) =>
          bindings.map { case (acceptor, port) =>
            acceptor ! DataReference(port, endpoint, graph)
          }
        }

        eventualDataReference.onFailure { case t =>
          self ! Failure("Component instance with ID " + component.componentInstance.id.map(_.toString).get + " has failed (" + t.getMessage + ").")
        }
      }
    }
    case run: Run => {
      if(component.isDataSource){
        val maybeDsConfig = component.dataSourceConfiguration
        maybeDsConfig.map { dsConfig =>
          bindings.map { case (acceptor, port) =>
            acceptor ! DataReference(port, dsConfig._1, dsConfig._2)
          }
        }
      }
    }
    case failure: Failure => {
      bindings.map { case (acceptor, port) =>
        acceptor ! failure
      }
    }
  }

  def saveBinding(binding: (ActorRef, String)) = bindings.+(binding)
}