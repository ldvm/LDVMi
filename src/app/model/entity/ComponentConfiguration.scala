package model.entity

import play.api.libs.json.{JsValue, Json}

class ComponentConfiguration(configuration: JsValue) {
  def \(fieldName: String) = configuration.\(fieldName)

  def \\(fieldName: String) = configuration.\\(fieldName)
}

object ComponentConfiguration {

  def apply(configurationString: Option[String]): ComponentConfiguration = {
    configurationString match {
      case Some(string) => new ComponentConfiguration(Json.parse(string))
      case _ => new ComponentConfiguration(Json.obj())
    }
  }

}
