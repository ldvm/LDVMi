package model.component

import model.entity._
import model.repository.TransformerRepository

trait TransformerService extends CrudService[TransformerId, Transformer, TransformerTable, TransformerRepository]