package model.appgen.repository

import model.appgen.service.{ApplicationsService, UserService, VisualizerService}
import scaldi.Module

class AppgenRepositoryModule extends Module {
  binding to new UsersRepository
  binding to new UserService
  binding to new UserDataSourcesRepository
  binding to new UserPipelineDiscoveryRepository
  binding to new VisualizerService
  binding to new ApplicationsRepository
  binding to new ApplicationsService
}
