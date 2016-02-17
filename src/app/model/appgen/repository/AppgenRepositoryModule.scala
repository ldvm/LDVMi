package model.appgen.repository

import model.appgen.service.{UserService}
import scaldi.Module

class AppgenRepositoryModule extends Module {
  binding to new UsersRepository
  binding to new UserService
  binding to new UserDataSourcesRepository
  binding to new UserPipelineDiscoveryRepository
}

