package model.component

import model.repository.DataSourceRepository
import scaldi.{Injectable, Injector}

class DataSourceServiceImpl(implicit inj: Injector) extends DataSourceService with Injectable {

  val repository = inject[DataSourceRepository]

}