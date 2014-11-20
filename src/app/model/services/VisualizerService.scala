package model.services

import model.dao.{Component, ComponentTable}

trait VisualizerService extends IdentityEagerCRUDService[Component, ComponentTable]