package data.models

import scala.slick.lifted.Column

trait IdentifiedEntityTable[E] {

  def id: Column[Long]

}
