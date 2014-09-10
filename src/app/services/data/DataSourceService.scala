package services.data

import data.models._
import play.api.db.slick.Session

trait DataSourceService extends IdentityEagerCRUDService[DataSource, DataSourcesTable] {

}
