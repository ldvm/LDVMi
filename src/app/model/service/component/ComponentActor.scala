package model.service.component

import akka.actor.{Actor, ActorRef, Props}
import model.service.SessionScoped
import play.api.Play.current
import play.api.libs.concurrent.Akka

import scala.collection.mutable.ArrayBuffer
import scala.concurrent.ExecutionContext.Implicits.global

case class RequestBindingCommand(remoteActor: ActorRef, bindingMessage: Bind)

case class Bind(portUri: String)

case class DataReference(portUri: String, endpointUri: String, graphUri: Option[String])

case class Failure(reason: String)

case class Run()

object ComponentActor {
  def props(component: InternalComponent, reporterProps: Props) = Props(new ComponentActor(component, reporterProps))
}

class ComponentActor(component: InternalComponent, reporterProps: Props) extends Actor with SessionScoped {

  private val outgoingBindings = new ArrayBuffer[(ActorRef, String)]()
  private val expectedDataRefSenders = new ArrayBuffer[ActorRef]()
  private val dataReferencesBySender = new ArrayBuffer[(ActorRef, DataReference)]
  private val allInputUris = withSession { implicit session => component.componentInstance.inputInstances.map(_.dataPortInstance.uri).distinct}
  private val logger = Akka.system.actorOf(reporterProps)
  private var resultReceiver: Option[ActorRef] = None

  def receive = {
    case c: Run => onRun()
    case c: Bind => onBind(c)
    case c: Failure => onFailure(c)
    case c: ResultRequest => onResultRequest()
    case c: DataReference => onDataReference(c)
    case c: RequestBindingCommand => onRequestBindingCommand(c)
  }

  private def onDataReference(dataReference: DataReference) {
    logger ! component.componentInstance.stringDescription + " got dataRef " + dataReference
    setResponse(sender(), dataReference)

    val coveredInputUris = dataReferencesBySender.map { case (_, DataReference(portUri, _, _)) => portUri}.distinct
    val canExecute = (coveredInputUris == allInputUris) && (expectedDataRefSenders.isEmpty || (dataReferencesBySender.map(_._1).toSeq == expectedDataRefSenders.toSeq))
    if (canExecute) {
      if (component.isVisualizer) {
        resultReceiver.map { r => r ! Result(dataReferencesBySender.map(_._2))}
        logger ! "==== DONE ===="
      } else {
        val eventualDataReference = component.evaluate(dataReferencesBySender.map(_._2).toSeq)

        eventualDataReference.onSuccess { case (endpoint, graph) =>
          outgoingBindings.map { case (acceptor, port) =>
            acceptor ! DataReference(port, endpoint, graph)
          }
        }

        eventualDataReference.onFailure { case t =>
          self ! Failure("Component instance with ID " + component.componentInstance.id.map(_.toString).get + " has failed (" + t.getMessage + ").")
        }
      }
    }else {
      logger ! "Cannot exec yet."
    }
  }

  private def setResponse(sender: ActorRef, dataRef: DataReference) = synchronized {
    dataReferencesBySender.append((sender, dataRef))
  }

  private def onResultRequest() {
    resultReceiver = Some(sender())
  }

  private def onRequestBindingCommand(requestBindingCommand: RequestBindingCommand) {
    expectedDataRefSenders.append(requestBindingCommand.remoteActor)
    requestBindingCommand.remoteActor ! requestBindingCommand.bindingMessage
  }

  private def onRun() {
    logger ! component.componentInstance.stringDescription + " got Run message "
    if (component.isDataSource) {
      val maybeDsConfig = component.dataSourceConfiguration
      maybeDsConfig.map { dsConfig =>
        outgoingBindings.map { case (acceptor, port) =>
          logger ! "Sending dr from " + self
          acceptor ! DataReference(port, dsConfig._1, dsConfig._2)
        }
      }
    }
  }

  private def onBind(bind: Bind) {
    logger ! component.componentInstance.stringDescription + " bound to " + bind.portUri + " for " + sender().toString()
    saveBinding((sender(), bind.portUri))
  }

  private def saveBinding(binding: (ActorRef, String)) = outgoingBindings.append(binding)

  private def onFailure(failure: Failure) {
    outgoingBindings.map { case (acceptor, port) =>
      acceptor ! failure
    }
  }
}