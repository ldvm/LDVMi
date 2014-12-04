package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class FeatureToComponentRepository extends CrudRepository[FeatureToComponentId, FeatureToComponent, FeatureToComponentTable](TableQuery[FeatureToComponentTable])
