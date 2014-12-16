package model.mess
/*
import java.util.concurrent.TimeUnit

import akka.actor.Props
import akka.util.Timeout
import model.mess.VisualizationService
import play.api.db.slick.Session
import play.api.libs.concurrent.Akka
import scaldi.{Injectable, Injector}




class LDVMServiceImpl(implicit inj: Injector) extends LDVMService with Injectable {

  //val visualizerService = inject[VisualizerService]
  val visualizationService = inject[VisualizationService]
  //val visualizerCompatibilityService = inject[VisualizerCompatibilityService]
  //val visualizerFeatureCompatibilityService = inject[VisualizerFeatureCompatibilityService]

  implicit val timeout = Timeout(5, TimeUnit.SECONDS)

  def checkVisualizationCompatibility(visualizationId: Long)
    (implicit session: Session) = {

        visualizationService.getByIdWithEager(visualizationId).map { visualizationEagerBox =>
          visualizerService.findAll.map { visualizer =>

            val checker = Akka.system.actorOf(Props[CompatibilityActor])

            val compatibility = visualizer.features.map { f =>
              (checker ask CheckCompatibility(visualizationEagerBox.datasource, f.signature, f.id)).mapTo[(Boolean, Long)]
            }

            Future.sequence(compatibility).onComplete { resultsTry =>
              resultsTry.foreach { results =>

                implicit var session = db.slick.DB.createSession()

                results.foreach { r =>
                  visualizerFeatureCompatibilityService.save(FeatureCompatibility(1, r._2, visualizationEagerBox.visualization.id, r._1))
                }

                val overallCompatibility = results.map(_._1).reduce((a, b) => a && b)

                visualizerCompatibilityService.insert(ComponentCompatibility(1, visualizer.id, visualizationEagerBox.visualization.id, overallCompatibility))

                session.close()
              }
            }
          }
        }
  }
}*/
