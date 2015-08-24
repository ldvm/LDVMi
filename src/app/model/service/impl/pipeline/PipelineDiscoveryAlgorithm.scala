package model.service.impl.pipeline

import akka.actor.{PoisonPill, Props}
import controllers.api.JsonImplicits._
import controllers.api.{PortCheckResult, ProgressReporter}
import model.entity._
import model.repository.PipelineDiscoveryRepository
import model.service.component.{Component, InternalComponent}
import model.service.impl.{DiscoveryInput, DiscoveryIterationInput}
import model.service.{PartialPipeline, PipelineService, PortMapping, SessionScoped}
import play.api.Play.current
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka
import play.api.libs.json.{JsObject, JsString, Json}
import scaldi.{Injectable, Injector}
import utils.CombinatoricsUtils

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Future, Promise}

object PipelineDiscoveryAlgorithm {
  val MaxIterations = 5
}

class PipelineDiscoveryAlgorithm(
  availableComponents: DiscoveryInput,
  maxIterations: Int = PipelineDiscoveryAlgorithm.MaxIterations
  )(reporterProps: Props)
  (implicit val inj: Injector, implicit val session: Session) extends SessionScoped with Injectable {

  val pipelineDiscoveryRepository = inject[PipelineDiscoveryRepository]
  val pipelineService = inject[PipelineService]
  val discovery = PipelineDiscovery(None, isFinished = false, isSuccess = None, lastPerformedIteration = None, pipelinesDiscoveredCount = None)
  val discoveryId = pipelineDiscoveryRepository.save(discovery)(session)
  val reporter = Akka.system.actorOf(reporterProps)

  def discoverPipelines()(implicit session: Session): PipelineDiscoveryId = {
    reportProgress(discovery.lastPerformedIteration, discovery.isFinished, discovery.pipelinesDiscoveredCount, discovery.isSuccess)

    val firstIterationData = DiscoveryIterationInput(0, pipelinesFromDataSources(availableComponents.dataSources), Seq())
    iterate(firstIterationData)
    discoveryId
  }

  private def iterate(iterationInput: DiscoveryIterationInput): Future[Seq[PartialPipeline]] = {
    reportMessage("****** Starting iteration " + iterationInput.number + " with " + iterationInput.partialPipelines.size + " partial pipeline(s)")

    val eventualCreatedPipelines = Future.sequence(tryChainComponents(iterationInput.partialPipelines))
    eventualCreatedPipelines.map(_.flatten).flatMap(finalizeIteration(iterationInput))
  }

  private def finalizeIteration(iterationInput: DiscoveryIterationInput)(createdPipelines: Seq[PartialPipeline]): Future[Seq[PartialPipeline]] = {

    val (partialPipelines, completePipelines) = createdPipelines.partition(_.componentInstances.last.hasOutput)
    reportMessage("Created partial pipelines: " + partialPipelines.size)

    val allCompleted = iterationInput.completePipelines ++ completePipelines
    reportMessage("All completed pipelines: " + allCompleted.size)

    save(completePipelines)

    val usedPartialPipelines = iterationInput.partialPipelines.map { p => p.copy(used = true) }

    val allPartial = usedPartialPipelines ++ partialPipelines
    reportMessage("All partial pipelines: " + allPartial.size)

    val stop = partialPipelines.isEmpty || (iterationInput.number > maxIterations)
    reportMessage("Stop?: " + stop)

    if (stop) {
      terminateDiscovery(iterationInput.number, allCompleted)
    } else {
      reportProgress(Some(iterationInput.number), isFinished = stop, Some(allCompleted.size), None)
      val nextIterationData = DiscoveryIterationInput(iterationInput.number + 1, allPartial, allCompleted)
      iterate(nextIterationData)
    }
  }

  private def terminateDiscovery(iterationsCount: Int, discoveredPipelines: Seq[PartialPipeline]): Future[Seq[PartialPipeline]] = {
    reportProgress(Some(iterationsCount), isFinished = true, Some(discoveredPipelines.size), isSuccess = Some(true))
    reporter ! PoisonPill
    Future(discoveredPipelines)
  }

  private def save(pipelines: Seq[PartialPipeline]): Unit = {
    try {

      withSession {

        val pipelinesToSave = availableComponents.fixedDataSource match {
          case Some(source) => pipelines.filter(_.componentInstances.exists(_.componentTemplateId == source.componentTemplateId))
          case _ => pipelines
        }

        implicit session =>
          pipelineService.saveDiscoveryResults(discoveryId, pipelinesToSave, reporter)
          reportMessage("Completed pipelines saved.")
          reporter ! Json.toJson(JsObject(Seq(("significantAction", JsString("pipelinesSaved")))))
      }

    } catch {
      case e: Throwable => {
        e.printStackTrace()
      }
    }
  }

  private def reportProgress(iteration: Option[Int], isFinished: Boolean, pipelinesCount: Option[Int], isSuccess: Option[Boolean] = None) {
    val discovery = PipelineDiscovery(
      Some(discoveryId),
      isFinished,
      isSuccess,
      iteration,
      pipelinesCount
    )
    withSession { implicit session =>
      pipelineDiscoveryRepository.save(discovery)
    }
    reporter ! Json.toJson(discovery)
  }

  private def reportMessage(message: String): Unit = {
    reporter ! message
  }

  private def tryChainComponents(partialPipelines: Seq[PartialPipeline]): Seq[Future[Seq[PartialPipeline]]] = {
    withSession { implicit session =>
      availableComponents.all.map { component =>
        reportMessage("Will try to add <" + component.componentTemplate.uri + ">")
        tryChainComponent(component, partialPipelines)
      }
    }
  }

  private def tryChainComponent(component: SpecificComponentTemplate, partialPipelines: Seq[PartialPipeline]): Future[Seq[PartialPipeline]] = {
    val promise = Promise[Seq[PartialPipeline]]()

    withSession { implicit session =>

      val internalComponent = InternalComponent(component, ProgressReporter.props)
      val inputTemplates = component.componentTemplate.inputTemplates

      val eventualInputsCompatibility = tryBindAllInputs(inputTemplates, internalComponent, partialPipelines, promise)
      eventualInputsCompatibility.onSuccess(inputBindingSuccessCallback(internalComponent, promise))
      eventualInputsCompatibility.onFailure({
        case e => {
          reportMessage("ERROR: " + e)
          promise.tryFailure(e)
        }
      })

      promise.future
    }
  }

  private def tryBindAllInputs(inputTemplates: Seq[InputTemplate], internalComponent: Component, partialPipelines: Seq[PartialPipeline], promise: Promise[Seq[PartialPipeline]])
    (implicit session: Session)
  : Future[Seq[Seq[Option[(PortMapping, PartialPipeline)]]]] = {

    val eventualPortResponses = inputTemplates.map { inputTemplate =>
      val futures = partialPipelines
        //.filter(_.componentInstances.last.hasOutput)
        .collect {

        case partialPipeline if internalComponent.hasDifferentTemplate(partialPipeline.componentInstances.last) =>
          
          val portUri = inputTemplate.dataPortTemplate.uri
          val lastComponent = InternalComponent(partialPipeline.componentInstances.last, ProgressReporter.props)

          reportMessage("Executing checks of <" + internalComponent.componentInstance.componentTemplate.uri + ">")

          val future = internalComponent.checkCouldBeBoundWithComponentViaPort(lastComponent, portUri, reporterProps)

          future.onFailure({ case e => {
            reportMessage("ERROR: " + e.getMessage)
            promise.tryFailure(e)
          }
          })
          future.collect({
            case true => {
              withSession { implicit session =>
                reportMessage("Able to bind <" + portUri + "> of <" + internalComponent.componentInstance.componentTemplate.uri + "> to <" + lastComponent.componentInstance.componentTemplate.uri + ">")
                reporter ! PortCheckResult(true, portUri, internalComponent.componentInstance.componentTemplate.uri, lastComponent.componentInstance.componentTemplate.uri)
                Some(PortMapping(partialPipeline.componentInstances.last, internalComponent.componentInstance, portUri), partialPipeline)
              }
            }
            case false => {
              withSession { implicit session =>
                reportMessage("Unable to bind <" + portUri + "> of <" + internalComponent.componentInstance.componentTemplate.uri + "> to <" + lastComponent.componentInstance.componentTemplate.uri + ">")
                reporter ! PortCheckResult(false, portUri, internalComponent.componentInstance.componentTemplate.uri, lastComponent.componentInstance.componentTemplate.uri)
                None
              }
            }
          })
      }

      reportMessage("Waiting for " + futures.size + " response(s).")

      Future.sequence(futures)
    }

    reportMessage("Waiting for " + eventualPortResponses.size + " port(s) to respond.")

    Future.sequence(eventualPortResponses)
  }

  private def inputBindingSuccessCallback(componentToAdd: Component, promise: Promise[Seq[PartialPipeline]])
  : PartialFunction[Seq[Seq[Option[(PortMapping, PartialPipeline)]]], Unit] = {
    case f if f.exists(_.forall(_.isEmpty)) => {
      reportMessage("At least one port wasn't bound. Nothing from this branch.")
      promise.trySuccess(Seq())
    }
    case s =>
      val solutions = s.map(_.collect { case Some(y) => y })
      val solutionCombinations = CombinatoricsUtils.combine(solutions).filter { combination =>
        combination.exists { case (_, fragment) => !fragment.used } //at least one needs to be unused
      }

      reportMessage("Found " + solutionCombinations.size + " solution(s).")

      val createdPipelines = solutionCombinations.map { oneCombinationForAllPorts =>
        val pipelines = oneCombinationForAllPorts.map { case (_, pipeline) => pipeline }

        val componentInstances = pipelines.flatMap(_.componentInstances).:+(componentToAdd.componentInstance)
        val portMappings = pipelines.flatMap(_.portMappings) ++ oneCombinationForAllPorts.map { case (mapping, _) => mapping }
        PartialPipeline(componentInstances, portMappings)
      }

      reportMessage("Adding " + createdPipelines.size + " partial pipeline(s).")
      promise.trySuccess(createdPipelines)
  }

  private def pipelinesFromDataSources(componentTemplates: Seq[SpecificComponentTemplate]): Seq[PartialPipeline] = {
    componentTemplates.collect {
      case d: DataSourceTemplate => PartialPipeline(Seq(InternalComponent(d, ProgressReporter.props).componentInstance), Seq())
    }
  }

}
