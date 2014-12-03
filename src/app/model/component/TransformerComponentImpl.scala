package model.component

import model.repository.TransformerRepository
import scaldi.{Injectable, Injector}

class TransformerComponentImpl(implicit inj: Injector)
  extends TransformerComponent with Injectable {

  val repository = inject[TransformerRepository]

}