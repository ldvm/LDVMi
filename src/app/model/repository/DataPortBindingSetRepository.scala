package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class DataPortBindingSetRepository extends CrudRepository[DataPortBindingSetId, DataPortBindingSet, DataPortBindingSetTable](TableQuery[DataPortBindingSetTable])
