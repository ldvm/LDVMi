package model.services

import model.dao.{VisualizerCompatibility, VisualizerCompatibilityTable}
import play.api.db.slick.Config.driver.simple._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class CompatibilityServiceImpl extends CompatibilityService {

  override val tableReference = TableQuery[VisualizerCompatibilityTable]

  def getByVisualizationId(id: Long)(implicit session: Session): Seq[VisualizerCompatibility] = {
    tableReference
      .filter(_.visualizationId === id)
      .sortBy { c =>
        (c.modifiedUtc.desc, c.createdUtc.desc)
      }.list
  }
}