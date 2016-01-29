package model.appgen.repository

import model.appgen.service.{DbSessionManager, UserService}
import scaldi.Module

class AppgenRepositoryModule extends Module {
  // binding to new DbSessionManager
  binding to new UsersRepository
  binding to new UserService
}

