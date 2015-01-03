package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class VisualizerTemplateRepository extends CrudRepository[VisualizerTemplateId, VisualizerTemplate, VisualizerTemplateTable](TableQuery[VisualizerTemplateTable])
