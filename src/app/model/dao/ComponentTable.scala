package model.dao

import org.joda.time.DateTime
import play.api.db.slick.Session

import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import scala.slick.lifted.Tag

import scala.slick.lifted.TableQuery

case class ComponentId(id: Long) extends AnyVal with BaseId
object ComponentId extends IdCompanion[ComponentId]

case class Component(
  id: Option[ComponentId],
  uri: String,
  title: Option[String],
  description: Option[String],
  outputId: Long,
  hasOutput: Boolean,
  hasInput: Boolean,
  defaultConfiguration: Option[String] = None,
  var createdUtc: Option[DateTime] = None,
  var modifiedUtc: Option[DateTime] = None
) extends DescribedEntity[ComponentId] {

  val componentFeaturesTable = TableQuery[ComponentFeaturesTable]
  val inputsTable = TableQuery[InputTable]

  def features(implicit s: Session): Seq[Feature] = (for {
    cf <- componentFeaturesTable if cf.componentId === id
    f <- featuresTable if cf.featureId === f.id
  } yield f).list

  def inputs(implicit s: Session): Seq[Input] = (for {
    i <- inputsTable if i.componentId === id
  } yield i).list
}

class ComponentTable(tag: Tag) extends DescribedEntityTable[ComponentId, Component](tag, "components") {

  def uri = column[String]("uri", O.NotNull)

  def defaultConfiguration = column[Option[String]]("default_configuration")

  def * = (id, uri, title, description, defaultConfiguration, createdUtc, modifiedUtc) <>(Component.tupled, Component.unapply _)

}



