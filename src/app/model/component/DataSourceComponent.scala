package model.component

import model.entity._
import model.repository.DataSourceRepository

trait DataSourceComponent extends CrudComponent[DataSourceId, DataSource, DataSourceTable, DataSourceRepository] {

}
