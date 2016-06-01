package model.appgen.rest
import controllers.api.JsonImplicits._
import play.api.libs.json.Json
import utils.PaginationInfo

object PaginatedRequest {
  case class PaginatedRequest(paginationInfo: PaginationInfo)
  implicit val reads = Json.reads[PaginatedRequest]
}
