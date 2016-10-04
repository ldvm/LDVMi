package model.assistant.rest

import model.assistant.entity.UserDataSourceId
import play.api.libs.json.Json

object RunDiscoveryRequest {
  case class RunDiscoveryRequest(userDataSourceIds: Seq[Long]) {
    def getIds = userDataSourceIds.map(id => new UserDataSourceId(id))
  }

  implicit val writes = Json.writes[RunDiscoveryRequest]
  implicit val reads = Json.reads[RunDiscoveryRequest]
}
