package model.dto

case class OutputInstance(
  uri: String,
  title: Option[String],
  templateUri: String,
  nestedBoundTo: List[String]
)
