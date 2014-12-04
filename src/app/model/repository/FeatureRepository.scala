package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class FeatureRepository extends CrudRepository[FeatureId, Feature, FeatureTable](TableQuery[FeatureTable])
