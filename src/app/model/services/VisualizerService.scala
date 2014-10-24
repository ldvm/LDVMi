package model.services

import model.dao.{Visualizer, VisualizerTable}

trait VisualizerService extends IdentityEagerCRUDService[Visualizer, VisualizerTable]