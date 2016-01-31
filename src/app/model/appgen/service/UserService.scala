package model.appgen.service

import model.appgen.repository.UsersRepository
import play.api.db.slick.Session
import org.h2.jdbc.JdbcSQLException
import scaldi.{Injectable, Injector}
import model.appgen.entity.{UserId, User}

class UserService(implicit inj: Injector) extends Injectable {
  val usersRepository = inject[UsersRepository]

  def add(name: String, email: String, password: String)(implicit session: Session): UserAddResult = {
    try {
      // TODO: Hash password
      val id = usersRepository save new User(None, name, email, password)
      UserSuccessfullyAdded(id)
    } catch {
      case (e: JdbcSQLException) =>
        if (e.getErrorCode == 23505) {
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
}

sealed trait UserAddResult
case object UserAlreadyExists extends UserAddResult
case class UserSuccessfullyAdded(id: UserId) extends UserAddResult
