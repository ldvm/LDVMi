package model.component

import model.repository.DataSourceRepository
import scaldi.{Injectable, Injector}

class DataSourceComponentImpl(implicit inj: Injector)
  extends DataSourceComponent with Injectable {

  val repository = inject[DataSourceRepository]

}