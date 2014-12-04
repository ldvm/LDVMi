package model.component

import model.entity._
import model.repository.VisualizerRepository

trait VisualizerService extends CrudService[VisualizerId, Visualizer, VisualizerTable, VisualizerRepository]