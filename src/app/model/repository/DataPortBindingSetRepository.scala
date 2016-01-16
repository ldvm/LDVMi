package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class DataPortBindingSetRepository extends CrudRepository[DataPortBindingSetId, DataPortBindingSet, DataPortBindingSetTable](TableQuery[DataPortBindingSetTable]) {
  def cleanup(implicit session: Session) = {
    val bindingSetsToDelete = query.filter(bs => !pipelinesQuery.filter(p => p.bindingSetId === bs.id).exists && !componentTemplatesQuery.filter(ct => ct.nestedBindingSetId === bs.id).exists)
    bindingsQuery.filter(b => bindingSetsToDelete.filter(bs => bs.id === b.bindingSetId).exists).delete
    nestedBindingsQuery.filter(b => bindingSetsToDelete.filter(bs => bs.id === b.bindingSetId).exists).delete
    bindingSetsToDelete.delete
  }
}
