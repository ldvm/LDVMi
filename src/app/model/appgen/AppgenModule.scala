package model.appgen

import model.appgen.repository._
import model.appgen.service._
import scaldi.Module

class AppgenModule extends Module {
  binding to new UsersRepository
  binding to new UserService
  binding to new UserDataSourcesRepository
  binding to new UserPipelineDiscoveryRepository
  binding to new VisualizerService
  binding to new ApplicationsRepository
  binding to new ApplicationsService
  binding to new GoogleIdTokenVerifier
  binding to new DiscoveriesService
  binding to new CacheEntriesRepository
  binding to new ResultCacheService
  binding to new InstallService
  binding to new UserDataSourcesService
}
