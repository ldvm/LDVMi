package model.repository

import com.github.tototoshi.slick.JdbcJodaSupport._
import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._
import utils.PaginationInfo

import scala.slick.lifted.{Ordered, TableQuery}

class PipelineRepository extends CrudRepository[PipelineId, Pipeline, PipelineTable](TableQuery[PipelineTable]) {

  def findPaginatedFilteredOrdered[T <% Ordered]
  (paginationInfo: PaginationInfo)
    (pipelineDiscoveryId: Option[PipelineDiscoveryId] = None, visualizerId: Option[ComponentTemplateId] = None, onlyPermanent: Boolean = false)
    (f: PipelineTable => T)(implicit s: Session)
  : Seq[Pipeline] = {

    if (visualizerId.isDefined) {
      if (onlyPermanent) {
        (for {
          e <- query if e.isTemporary === false
        } yield e).list.filter(_.componentInstances.exists(_.componentTemplateId == visualizerId.get))
      } else {
        (for {
          e <- query
        } yield e).list.filter(_.componentInstances.exists(_.componentTemplateId == visualizerId.get))
      }
    } else {
      pipelineDiscoveryId.map { id =>
        if (onlyPermanent) {
          (for {
            e <- query
              .filter(_.pipelineDiscoveryId === pipelineDiscoveryId)
              .filter(_.isTemporary === false)
              .sortBy(f)
              .drop(paginationInfo.skipCount)
              .take(paginationInfo.pageSize)
          } yield e).list
        }else{
          (for {
            e <- query
              .filter(_.pipelineDiscoveryId === pipelineDiscoveryId)
              .sortBy(f)
              .drop(paginationInfo.skipCount)
              .take(paginationInfo.pageSize)
          } yield e).list
        }
      }.getOrElse {
        if (onlyPermanent) {
          (for {
            e <- query
              .filter(_.isTemporary === false)
              .sortBy(f)
              .drop(paginationInfo.skipCount)
              .take(paginationInfo.pageSize)
          } yield e).list
        }else{
          (for {
            e <- query
              .sortBy(f)
              .drop(paginationInfo.skipCount)
              .take(paginationInfo.pageSize)
          } yield e).list
        }
      }
    }

  }

  def deleteExpired(hoursCount: Int)(implicit session: Session) = {
    query.filter(p => {
      p.createdUtc < new org.joda.time.DateTime().minusHours(hoursCount) &&
        p.isTemporary && !pipelineEvaluationQuery.filter(e => e.pipelineId === p.id).exists
    }).delete
  }
}
