package model.assistant.entity

import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import scala.slick.lifted.Tag


/** Id class for type-safe joins and queries. */
case class UserId(id: Long) extends AnyVal with BaseId

/**
 * Companion object for id class, extends IdMapping
 * and brings all required implicits to scope when needed.
 */
object UserId extends IdCompanion[UserId]

/**
 * User entity.
 *
 * @param id user id
 * @param name full name
 * @param email user email address
 */
case class User(id: Option[UserId], name: String, email: String, password: String, isAdmin: Boolean)
  extends WithId[UserId]


/** Table definition for users. */
class Users(tag: Tag) extends IdTable[UserId, User](tag, "assistant_users") {


  // use this property if you want to change name of `id` column to uppercase
  // you need this on H2 for example
  override val idColumnName = "id"

  def name = column[String]("name", O.NotNull)

  def email = column[String]("email", O.NotNull)

  def password = column[String]("password", O.NotNull)

  def isAdmin = column[Boolean]("isAdmin", O.Default(false))

  def idx = index("idx_unique_email", email, unique = true)

  override def * = (id.?, name, email, password, isAdmin) <> (User.tupled, User.unapply)
}