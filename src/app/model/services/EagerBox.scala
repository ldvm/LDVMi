package model.services

trait EagerBox[E] {
  def mainEntity: E
}

case class IdentityEagerBox[E](entity: E) extends EagerBox[E] {
  override def mainEntity: E = entity
}
