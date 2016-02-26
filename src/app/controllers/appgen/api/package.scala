package controllers.appgen

import model.appgen.entity.{Application, Visualizer, UserPipelineDiscovery, UserDataSource}
import model.entity.CustomUnicornPlay
import play.api.libs.json.{Writes, JsNumber, Json}

package object api {
  object JsonImplicits {
    implicit val idWrites : Writes[CustomUnicornPlay.BaseId] = Writes {
      typedId => JsNumber(typedId.id)
    }

    implicit val userDataSourceWrites = Json.writes[UserDataSource]
    implicit val userPipelineDiscoveryWrites = Json.writes[UserPipelineDiscovery]
    implicit val applicationWrites = Json.writes[Application]
  }
}
