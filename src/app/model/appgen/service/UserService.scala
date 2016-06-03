package model.appgen.service

import java.util.UUID

import model.appgen.repository.UsersRepository
import play.api.db.slick.Session
import org.h2.jdbc.JdbcSQLException
import scaldi.{Injectable, Injector}
import model.appgen.entity.{User, UserId}
import org.h2.constant.ErrorCode
import org.mindrot.jbcrypt.BCrypt

class UserService(implicit inj: Injector) extends Injectable {
  val usersRepository = inject[UsersRepository]
  val googleIdTokenVerifier = inject[GoogleIdTokenVerifier]

  def add(name: String, email: String, password: String)(implicit session: Session): UserAddResult = {
    try {
      val hash = BCrypt.hashpw(password, BCrypt.gensalt())
      val id = usersRepository save new User(None, name, email, hash, false)
      UserSuccessfullyAdded(id)
    } catch {
      case (e: JdbcSQLException) =>
        if (e.getErrorCode == ErrorCode.DUPLICATE_KEY_1) {
          UserAlreadyExists
        } else {
          throw e
        }
      case (e: Throwable) => throw e
    }
  }

  def find(email: String, password: String)(implicit session: Session): Option[User] = {
    usersRepository.find(email) filter { user =>
      BCrypt.checkpw(password, user.password)
    }
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
