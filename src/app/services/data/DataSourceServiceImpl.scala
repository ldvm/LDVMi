package services.data

import data.models._
import play.api.db.slick.Session

import scala.slick.lifted.TableQuery

class DataSourceServiceImpl extends DataSourceService {

  override val tableReference = TableQuery[DataSourcesTable]

}
