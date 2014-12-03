package model.repository

import model.entity.{Component, ComponentId, ComponentTable}

import scala.slick.lifted.TableQuery
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class ComponentRepository extends CrudRepository[ComponentId, Component, ComponentTable](TableQuery[ComponentTable])
