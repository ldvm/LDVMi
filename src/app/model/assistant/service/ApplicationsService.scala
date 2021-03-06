package model.assistant.service

import model.assistant.entity.{Application, ApplicationId, User}
import model.assistant.repository.{ApplicationsRepository, UsersRepository}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}
import utils.PaginationInfo

class ApplicationsService(implicit inj: Injector) extends Injectable {
  val usersRepository = inject[UsersRepository]
  val applicationsRepository = inject[ApplicationsRepository]

  def getApplicationIfAccessible(id: ApplicationId, user: Option[User])(implicit session: Session): Option[Application] = {
    val isAdmin = user.exists(_.isAdmin)

    // Return the application only it it exists and is either published or is accessed by its owner
    for {
      application <- applicationsRepository.findById(id)
      owner <- usersRepository.findById(application.userId)
      accessible <- if (application.published || user.contains(owner) || isAdmin) Some(true) else None
    } yield application
  }

  def findByUser(user: User)(implicit session: Session) = applicationsRepository.findByUser(user)

  def findByUser(user: User, paginationInfo: PaginationInfo)(implicit session: Session)
    = applicationsRepository.findByUser(user, paginationInfo)

  def countByUser(user: User)(implicit session: Session) = applicationsRepository.countByUser(user)
}
