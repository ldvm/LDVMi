package model.dto

case class Pipeline(uri: String, title: Option[String], componentInstances: Seq[ConcreteComponentInstance])
