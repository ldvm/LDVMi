package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class VisualizationConfigurationRepository extends CrudRepository[VisualizationConfigurationId, VisualizationConfiguration, VisualizationConfigurationTable](TableQuery[VisualizationConfigurationTable])
