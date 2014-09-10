package services.data

trait EagerBox[E] {

}

case class IdentityEagerBox[E](entity: E) extends EagerBox[E]
