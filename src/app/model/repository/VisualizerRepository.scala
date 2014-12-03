package model.repository

import model.entity._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class VisualizerRepository extends CrudRepository[VisualizerId, Visualizer, VisualizerTable](TableQuery[VisualizerTable])
