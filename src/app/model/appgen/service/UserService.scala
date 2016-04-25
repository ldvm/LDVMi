package model.appgen.service

import java.util.UUID

import model.appgen.repository.UsersRepository
import play.api.db.slick.Session
import org.h2.jdbc.JdbcSQLException
import scaldi.{Injectable, Injector}
import model.appgen.entity.{User, UserId}

class UserService(implicit inj: Injector) extends Injectable {
  val usersRepository = inject[UsersRepository]
  val googleIdTokenVerifier = inject[GoogleIdTokenVerifier]

  def add(name: String, email: String, password: String)(implicit session: Session): UserAddResult = {
    try {
      // TODO: Hash password
      val id = usersRepository save new User(None, name, email, password)
      UserSuccessfullyAdded(id)
    } catch {
      case (e: JdbcSQLException) =>
        if (e.getErrorCode == 23505) { // TODO: replace by a constant
          UserAlreadyExists
        } else {
          throw e
        }
      case (e: Throwable) => throw e
    }
  }

  def find(email: String, password: String)(implicit session: Session): Option[User] = {
    // TODO: Hash password
    usersRepository.find(email, password)
  }

  def find(email: String)(implicit session: Session): Option[User] = {
    usersRepository.find(email)
  }

  def googleSignIn(token: String)(implicit session: Session): Option[User] = {
    googleIdTokenVerifier.verify(token) match {
      case Some(verifiedToken) => {
        find(verifiedToken.email) match {
          case Some(user) => Some(user)
          case None => {
            // If the user doesn't exist yet, let's add him. A random long string will be used
            // as his password (he is not going to need it anyway).
            add(verifiedToken.name, verifiedToken.email, UUID.randomUUID().toString)
            find(verifiedToken.email)
          }
        }
      }
      case None => None
    }
  }
}

sealed trait UserAddResult
case object UserAlreadyExists extends UserAddResult
case class UserSuccessfullyAdded(id: UserId) extends UserAddResult
