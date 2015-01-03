package model.service.component

import model.entity.Descriptor
import play.api.db.slick.Session

trait Component {
  def check(context: BindingContext)(implicit session: Session)

  def checkIsCompatibleWith(descriptor: Descriptor)(implicit session: Session)

  def checkCouldBeBoundWith(component: Component)(implicit session: Session)
}
