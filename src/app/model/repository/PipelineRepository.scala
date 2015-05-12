package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._
import utils.PaginationInfo

import scala.slick.lifted.{Ordered, TableQuery}

class PipelineRepository extends CrudRepository[PipelineId, Pipeline, PipelineTable](TableQuery[PipelineTable]) {

  def findPaginatedFilteredOrdered[T <% Ordered]
  (paginationInfo: PaginationInfo)
    (pipelineDiscoveryId: Option[PipelineDiscoveryId] = None, visualizerId: Option[ComponentTemplateId] = None)
    (f: PipelineTable => T)(implicit s: Session)
  : Seq[Pipeline] = {

    if(visualizerId.isDefined){
      (for {
        e <- query
      } yield e).list.filter(_.componentInstances.exists(_.componentTemplateId == visualizerId.get))
    } else {
      pipelineDiscoveryId.map { id =>
        (for {
          e <- query
            .filter(_.pipelineDiscoveryId === pipelineDiscoveryId)
            .sortBy(f)
            .drop(paginationInfo.skipCount)
            .take(paginationInfo.pageSize)
        } yield e).list
      }.getOrElse {
        super.findPaginatedOrdered(paginationInfo.skipCount, paginationInfo.pageSize)(f)
      }
    }

  }
}
