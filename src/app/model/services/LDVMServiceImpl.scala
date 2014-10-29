package model.services

import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.pattern.ask
import akka.util.Timeout
import model.dao.VisualizerCompatibility
import model.services.actors.{CheckCompatibility, CompatibilityActor}
import play.api.Play.current
import play.api.db
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka
import play.api.libs.concurrent.Execution.Implicits._
import scaldi.{Injectable, Injector}


case class Compatible(x: Boolean, z: Boolean)

class LDVMServiceImpl(implicit inj: Injector) extends LDVMService with Injectable {

  val visualizerService = inject[VisualizerService]
  val visualizationService = inject[VisualizationService]
  val compatibilityService = inject[CompatibilityService]

  implicit val timeout = Timeout(5, TimeUnit.SECONDS)

  def checkVisualizationCompatibility(visualizationId: Long)
      (implicit session: Session) = {

    visualizationService.getByIdWithEager(visualizationId).map { visualizationEagerBox =>
      visualizerService.list.map { visualizer =>

        val checker = Akka.system.actorOf(Props[CompatibilityActor])

        val result = for {
          c <- (checker ask CheckCompatibility(visualizationEagerBox.dataSource, visualizer.inputSignature)).mapTo[Boolean]
          cd <- (checker ask CheckCompatibility(visualizationEagerBox.dsdDataSource, visualizer.dsdInputSignature.getOrElse("ASK { ?s ?p ?o . }"))).mapTo[Boolean]
        } yield Compatible(c, cd)

        result.onComplete { tryCompatible =>
          tryCompatible.map { compatible =>
            if (compatible.x && compatible.z) {
              implicit var session = db.slick.DB.createSession()
              val vid = visualizerService.getById(visualizer.id)
              compatibilityService.insert(VisualizerCompatibility(1000, visualizer.id, None, Some(visualizationEagerBox.visualization.id)))
              session.close()
            }
          }
        }

      }
    }
  }
}
