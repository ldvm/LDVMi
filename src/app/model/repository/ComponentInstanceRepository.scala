package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity.{ComponentInstance, ComponentInstanceId, ComponentInstanceTable, CustomUnicornPlay}

import scala.slick.lifted.TableQuery

class ComponentInstanceRepository extends CrudRepository[ComponentInstanceId, ComponentInstance, ComponentInstanceTable](TableQuery[ComponentInstanceTable])
