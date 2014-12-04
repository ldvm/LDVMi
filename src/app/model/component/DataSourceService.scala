package model.component

import model.entity._
import model.repository.DataSourceRepository

trait DataSourceService extends CrudService[DataSourceId, DataSource, DataSourceTable, DataSourceRepository]