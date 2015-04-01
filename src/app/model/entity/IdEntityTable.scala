package model.entity

import org.joda.time.DateTime
import CustomUnicornPlay._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.{AbstractTable, TableQuery}
import scala.slick.model.ForeignKeyAction

trait IdEntity[Id <: BaseId] extends WithId[Id] {

  var modifiedUtc: Option[DateTime]
  var createdUtc: Option[DateTime]
  var uuid: String
}

trait DescribedEntity[Id <: BaseId] extends IdEntity[Id] {
  def title: String
  def description: Option[String]
}

trait UriIdentifiedEntity[Id <: BaseId] extends DescribedEntity[Id] {
  def uri: String
}

abstract class IdEntityTable[Id <: BaseId, Entity <: IdEntity[Id]](tag: Tag, schemaName: Option[String], tableName: String)
  (override implicit val mapping: BaseColumnType[Id])
  extends IdTable[Id, Entity](tag, schemaName, tableName)(mapping) {

  protected val createdColumnName: String = "created"
  protected val modifiedColumnName: String = "modified"
  protected val uuidColumnName: String = "uuid"

  def this(tag: Tag, tableName: String)(implicit mapping: BaseColumnType[Id]) = this(tag, None, tableName)

  def shortName = tableName.split("_").map(_.charAt(0)).mkString.toString

  def fkName(mappedToSuffix: String) = "fk_" + shortName + "t" + "_" + mappedToSuffix

  final def uuid = column[String](uuidColumnName, O.NotNull)

  final def createdUtc = column[Option[DateTime]](createdColumnName)

  final def modifiedUtc = column[Option[DateTime]](modifiedColumnName)
}

abstract class DescribedEntityTable[Id <: BaseId, Entity <: DescribedEntity[Id]](tag: Tag, schemaName: Option[String], tableName: String)
  (override implicit val mapping: BaseColumnType[Id])
  extends IdEntityTable[Id, Entity](tag, schemaName, tableName)(mapping) {

  protected val descriptionColumnName: String = "description"
  protected val titleColumnName: String = "title"

  def this(tag: Tag, tableName: String)(implicit mapping: BaseColumnType[Id]) = this(tag, None, tableName)

  final def title = column[String](titleColumnName)

  final def description = column[Option[String]](descriptionColumnName)
}

abstract class UriIdentifiedEntityTable[Id <: BaseId, Entity <: UriIdentifiedEntity[Id]](tag: Tag, schemaName: Option[String], tableName: String)
  (override implicit val mapping: BaseColumnType[Id])
  extends DescribedEntityTable[Id, Entity](tag, schemaName, tableName)(mapping) {

  protected val uriColumnName: String = "uri"

  def this(tag: Tag, tableName: String)(implicit mapping: BaseColumnType[Id]) = this(tag, None, tableName)

  final def uri = column[String](uriColumnName)
}
