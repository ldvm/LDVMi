package model.service

import akka.actor.Props
import model.entity.{DataPortBindingSet, DataPortBindingSetCompatibilityCheckId}
import play.api.db.slick._

trait CompatibilityService {
  def check(bindingSet: DataPortBindingSet, reporterProps: Props)(implicit session: Session): DataPortBindingSetCompatibilityCheckId
}
