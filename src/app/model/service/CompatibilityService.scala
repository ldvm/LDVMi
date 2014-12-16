package model.service

import model.entity.DataPortBindingSet
import play.api.db.slick._

trait CompatibilityService {
  def check(bindingSet: DataPortBindingSet)(implicit session: Session)
}
