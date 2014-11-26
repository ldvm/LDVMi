package model.entity

import org.joda.time.DateTime
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

trait IdEntity[Id <: BaseId] extends WithId[Id] {

  var modifiedUtc: Option[DateTime]
  var createdUtc: Option[DateTime]
}

trait DescribedEntity[Id <: BaseId] extends IdEntity[Id] {
  def title: String
  def description: Option[String]
}

abstract class IdEntityTable[Id <: BaseId, Entity <: IdEntity[Id]](tag: Tag, schemaName: Option[String], tableName: String)(override implicit val mapping: BaseColumnType[Id])
  extends IdTable[Id, Entity](tag, schemaName, tableName)(mapping) {

  protected val createdColumnName: String = "created"
  protected val modifiedColumnName: String = "modified"

  def this(tag: Tag, tableName: String)(implicit mapping: BaseColumnType[Id]) = this(tag, None, tableName)

  final def createdUtc = column[Option[DateTime]](createdColumnName)

  final def modifiedUtc = column[Option[DateTime]](modifiedColumnName)
}

abstract class DescribedEntityTable[Id <: BaseId, Entity <: DescribedEntity[Id]](tag: Tag, schemaName: Option[String], tableName: String)(override implicit val mapping: BaseColumnType[Id])
  extends IdEntityTable[Id, Entity](tag, schemaName, tableName)(mapping) {

  protected val descriptionColumnName: String = "description"
  protected val titleColumnName: String = "title"

  def this(tag: Tag, tableName: String)(implicit mapping: BaseColumnType[Id]) = this(tag, None, tableName)

  final def title = column[String](titleColumnName)

  final def description = column[Option[String]](descriptionColumnName)
}
