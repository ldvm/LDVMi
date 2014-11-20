package model.dao

import org.joda.time.DateTime
import scala.slick.lifted._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import org.virtuslab.unicorn.LongUnicornPlay._

trait IdEntity[Id <: BaseId] extends WithId[Id] {

  var modifiedUtc: Option[DateTime]
  var createdUtc: Option[DateTime]

  def id: Long
}

abstract class IdEntityTable[Id <: BaseId, Entity <: WithId[Id]](tag: Tag, schemaName: Option[String], tableName: String)
  extends IdTable[Id, Entity](tag, schemaName, tableName)
  {

  protected val createdColumnName: String = "created"
  protected val modifiedColumnName: String = "modified"

  def this(tag: Tag, tableName: String)(implicit mapping: BaseColumnType[Id]) = this(tag, None, tableName)

  final def createdUtc = column[Option[DateTime]](createdColumnName)

  final def modifiedUtc = column[Option[DateTime]](modifiedColumnName)
}

abstract class DescribedEntityTable[Id <: BaseId, Entity <: WithId[Id]](tag: Tag, schemaName: Option[String], tableName: String)
  extends IdEntityTable[Id, Entity](tag, schemaName, tableName){

  protected val descriptionColumnName: String = "description"
  protected val titleColumnName: String = "title"

  def this(tag: Tag, tableName: String)(implicit mapping: BaseColumnType[Id]) = this(tag, None, tableName)

  final def title = column[String](titleColumnName)

  final def description = column[Option[String]](descriptionColumnName)
}
