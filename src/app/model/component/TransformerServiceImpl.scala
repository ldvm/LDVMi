package model.component

import model.repository.TransformerRepository
import scaldi.{Injectable, Injector}

class TransformerServiceImpl(implicit inj: Injector) extends TransformerService with Injectable {

  val repository = inject[TransformerRepository]

}