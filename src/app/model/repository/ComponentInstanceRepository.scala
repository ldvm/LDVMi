package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity.{ComponentInstance, ComponentInstanceId, ComponentInstanceTable, CustomUnicornPlay}

import scala.slick.lifted.TableQuery

class ComponentInstanceRepository extends UriIdentifiedRepository[ComponentInstanceId, ComponentInstance, ComponentInstanceTable](TableQuery[ComponentInstanceTable])
