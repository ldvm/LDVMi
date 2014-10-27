package model.services

import play.api.db.slick._

trait LDVMService {
  def checkVisualizationCompatibility(id: Long)
      (implicit session: Session)
}
