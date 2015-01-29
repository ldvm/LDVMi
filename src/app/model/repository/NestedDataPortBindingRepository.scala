package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class NestedDataPortBindingRepository extends CrudRepository[NestedDataPortBindingId, NestedDataPortBinding, NestedDataPortBindingTable](TableQuery[NestedDataPortBindingTable])
