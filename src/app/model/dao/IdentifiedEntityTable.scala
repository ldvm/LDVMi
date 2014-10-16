package model.dao

import org.joda.time.DateTime

import scala.slick.lifted.Column

trait IdentifiedEntity {

  var modifiedUtc: Option[DateTime]
  var createdUtc: Option[DateTime]

  def id: Long
}

trait IdentifiedEntityTable[E <: IdentifiedEntity] {

  def id: Column[Long]

  def createdUtc: Column[Option[DateTime]]

  def modifiedUtc: Column[Option[DateTime]]

}
