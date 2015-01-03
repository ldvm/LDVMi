package model.service.component

import model.entity.Descriptor
import play.api.db.slick.Session

class ExternalComponent extends Component {
  def check(context: BindingContext)(implicit session: Session): Unit = ???

  def checkCouldBeBoundWith(component: Component)(implicit session: Session): Unit = ???

  def checkIsCompatibleWith(descriptor: Descriptor)(implicit session: Session): Unit = ???
}
