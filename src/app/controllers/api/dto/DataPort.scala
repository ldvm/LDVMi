package controllers.api.dto

case class DataPort(
  uri: String,
  title: Option[String],
  description: Option[String]
)
