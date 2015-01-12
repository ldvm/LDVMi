package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.{Ordered, TableQuery}

class PipelineRepository extends CrudRepository[PipelineId, Pipeline, PipelineTable](TableQuery[PipelineTable]) {

  def findPaginatedFilteredOrdered[T <% Ordered]
  (skip: Int = 0, pageSize: Int = 0)
    (pipelineDiscoveryId: Option[PipelineDiscoveryId] = None)
    (f: PipelineTable => T)(implicit s: Session)
  : Seq[Pipeline] = {
    pipelineDiscoveryId.map { id =>
      (for {
        e <- query.filter(_.pipelineDiscoveryId === pipelineDiscoveryId).sortBy(f).drop(skip).take(pageSize)
      } yield e).list
    }.getOrElse {
      super.findPaginatedOrdered(skip, pageSize)(f)
    }
  }
}
