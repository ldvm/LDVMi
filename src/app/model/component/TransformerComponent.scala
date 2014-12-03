package model.component

import model.entity._
import model.repository.TransformerRepository

trait TransformerComponent extends CrudComponent[TransformerId, Transformer, TransformerTable, TransformerRepository] {

}
