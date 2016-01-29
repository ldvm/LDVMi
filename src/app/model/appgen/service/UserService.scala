package model.appgen.service

import model.appgen.repository.UsersRepository
import play.api.db.slick.Session
import org.h2.jdbc.JdbcSQLException
import scaldi.{Injectable, Injector}
import model.appgen.entity.{UserId, User}

class UserService(implicit inj: Injector) extends Injectable {
  val usersRepository = inject[UsersRepository]

  def addUser(user: User)(implicit session: Session): UserAddResult = {
    try {
      val id = usersRepository save user
      UserSuccessfullyAdded(id)
    } catch {
      case (e: JdbcSQLException) =>
        if (e.getErrorCode == 23505) {
          UserAlreadyExists
        } else {
          throw e
        }
      case (e) => throw e
    }
  }
}

sealed trait UserAddResult
case object UserAlreadyExists extends UserAddResult
case class UserSuccessfullyAdded(id: UserId) extends UserAddResult
