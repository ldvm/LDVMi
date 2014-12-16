package model.repository

import model.entity.{CustomUnicornPlay, Component, ComponentId, ComponentTable}

import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class ComponentRepository extends UriIdentifiedRepository[ComponentId, Component, ComponentTable](TableQuery[ComponentTable])
