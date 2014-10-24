package model.services

import model.dao._

import scala.slick.lifted.TableQuery

class VisualizerServiceImpl extends VisualizerService {

  override val tableReference = TableQuery[VisualizerTable]

}
