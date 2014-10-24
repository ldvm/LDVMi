package model.services

import model.dao.{VisualizationTable, VisualizationEagerBox, Visualization}

trait VisualizationService extends CRUDService[Visualization, VisualizationTable, VisualizationEagerBox]