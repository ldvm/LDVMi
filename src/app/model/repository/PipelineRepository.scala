package model.repository

import java.util.Formatter.DateTime

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._
import utils.PaginationInfo
import com.github.tototoshi.slick.JdbcJodaSupport._

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

  def deleteExpired(hoursCount: Int)(implicit session: Session) = {
    query.filter(p => {
      p.createdUtc < new org.joda.time.DateTime().minusHours(hoursCount) &&
      p.isTemporary &&
      pipelineEvaluationQuery.filter(e => e.pipelineId === p.id).length === 0
    }).delete
  }
}
