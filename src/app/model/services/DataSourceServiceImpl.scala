package model.services

import model.dao.DataSourcesTable

import scala.slick.lifted.TableQuery

class DataSourceServiceImpl extends DataSourceService {

  override val tableReference = TableQuery[DataSourcesTable]

}
