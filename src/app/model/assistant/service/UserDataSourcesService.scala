package model.assistant.service

import model.assistant.entity.{UserDataSource, UserDataSourceId, UserId}
import model.assistant.repository.UserDataSourcesRepository
import model.entity.DataSourceTemplateId
import model.repository.{ComponentTemplateRepository, DataSourceTemplateRepository}
import play.api.db.slick.Session
import scaldi.{Injectable, Injector}

class UserDataSourcesService(implicit inj: Injector) extends Injectable {
  val componentTemplateRepository = inject[ComponentTemplateRepository]
  val dataSourceTemplateRepository = inject[DataSourceTemplateRepository]
  val userDataSourcesRepository = inject[UserDataSourcesRepository]

  def add(dataSourceTemplateId: DataSourceTemplateId, name: String, isPublic: Boolean, userId: UserId)(implicit session: Session): UserDataSourceId = {
    // We need to make sure that is the data source LDVM component is not temporary
    makeDataSourcePermanent(dataSourceTemplateId)
    userDataSourcesRepository save
      UserDataSource(None, name, isPublic, userId, dataSourceTemplateId)
  }

  def makeDataSourcePermanent(dataSourceTemplateId: DataSourceTemplateId)(implicit session: Session) {
    dataSourceTemplateRepository
      .findById(dataSourceTemplateId)
      .flatMap(dataSourceTemplate => componentTemplateRepository.findById(dataSourceTemplate.componentTemplateId))
      .map(componentTemplate => componentTemplateRepository.save(componentTemplate.copy(isTemporary = false)))
  }

}
