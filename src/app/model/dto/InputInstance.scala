package model.dto

case class InputInstance(
  uri: String,
  title: Option[String],
  templateUri: String,
  boundTo: String
)
