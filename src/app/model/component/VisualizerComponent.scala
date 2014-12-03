package model.component

import model.entity._
import model.repository.VisualizerRepository

trait VisualizerComponent extends CrudComponent[VisualizerId, Visualizer, VisualizerTable, VisualizerRepository] {

}
