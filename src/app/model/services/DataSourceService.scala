package model.services

import model.dao.{DataSourcesTable, DataSource}

trait DataSourceService extends IdentityEagerCRUDService[DataSource, DataSourcesTable] {

}
