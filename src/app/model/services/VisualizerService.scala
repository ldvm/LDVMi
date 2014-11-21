package model.services

import model.dao.{VisualizerId, Component, ComponentTable}

trait VisualizerService extends IdentityEagerCRUDService[VisualizerId, Component, ComponentTable]