import com.typesafe.sbt.jse.JsEngineImport.JsEngineKeys
import com.typesafe.sbt.jshint.Import.JshintKeys

name := """play-scala"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.10.0"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "com.typesafe.slick" %% "slick" % "2.0.0",
  "com.typesafe.play" %% "play-slick" % "0.6.0.1",
  "org.webjars" %% "webjars-play" % "2.3.0",
  "org.webjars" % "angularjs" % "1.2.18",
  "org.webjars" % "bootstrap" % "3.1.1-2"
)

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node
JshintKeys.config