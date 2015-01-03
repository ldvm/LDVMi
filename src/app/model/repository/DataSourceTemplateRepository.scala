package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class DataSourceTemplateRepository extends CrudRepository[DataSourceTemplateId, DataSourceTemplate, DataSourceTemplateTable](TableQuery[DataSourceTemplateTable])
