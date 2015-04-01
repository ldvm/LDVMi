package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class DataPortBindingRepository extends CrudRepository[DataPortBindingId, DataPortBinding, DataPortBindingTable](TableQuery[DataPortBindingTable])
