package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class DataPortInstanceRepository extends CrudRepository[DataPortInstanceId, DataPortInstance, DataPortInstanceTable](TableQuery[DataPortInstanceTable])
