package model.service.component

import model.entity.DataPortBindingSet
import play.api.db.slick.Session

case class BindingContext(context: Map[String, Component]) {
  def apply(inputTemplateUri: String) = context.apply(inputTemplateUri)
}

object BindingContext {
  def apply(bindingSet: DataPortBindingSet)(implicit session: Session): BindingContext = {
    val context = bindingSet.bindings.map { b =>
      (b.target.uri, InternalComponent(b.source.componentInstance))
    }.toMap

    new BindingContext(context)
  }
}