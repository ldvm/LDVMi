package model.repository

import model.entity._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class DataSourceRepository extends CrudRepository[DataSourceId, DataSource, DataSourceTable](TableQuery[DataSourceTable])
