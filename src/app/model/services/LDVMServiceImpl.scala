package model.services

import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.pattern.ask
import akka.util.Timeout
import model.services.actors.{CheckCompatibility, CompatibilityActor}
import play.api.Play.current
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka
import scaldi.{Injectable, Injector}
import play.api.libs.concurrent.Execution.Implicits._

case class Compatible(x: Boolean, z: Boolean)

class LDVMServiceImpl(implicit inj: Injector) extends LDVMService with Injectable {

  val visualizerService = inject[VisualizerService]
  val visualizationService = inject[VisualizationService]

  implicit val timeout = Timeout(5, TimeUnit.SECONDS)

  def checkVisualizationCompatibility(visualizationId: Long)
      (implicit session: Session) = {

    visualizationService.getByIdWithEager(visualizationId).map { visualizationEagerBox =>
      visualizerService.list.map{ visualizer =>

        val checker = Akka.system.actorOf(Props[CompatibilityActor])

        val result = for {
          c <- (checker ask CheckCompatibility(visualizationEagerBox.dataSource, visualizer.inputSignature)).mapTo[Boolean]
          cd <- (checker ask CheckCompatibility(visualizationEagerBox.dsdDataSource, visualizer.dsdInputSignature.getOrElse("ASK { ?s ?p ?o . }"))).mapTo[Boolean]
        } yield Compatible(c, cd)

        result.onComplete{ tryCompatible =>
          tryCompatible.map{ compatible =>
            val result = compatible.x && compatible.z
            println(result)
          }.getOrElse(println("fail"))
        }

      }
    }
  }
}
