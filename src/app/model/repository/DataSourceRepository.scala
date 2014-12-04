package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class DataSourceRepository extends CrudRepository[DataSourceId, DataSource, DataSourceTable](TableQuery[DataSourceTable])
