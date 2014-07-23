import com.typesafe.sbt.jse.JsEngineImport.JsEngineKeys
import play.PlayScala

name := """payola-viz"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.10.0"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "com.typesafe.slick" %% "slick" % "2.0.2",
  "org.webjars" %% "webjars-play" % "2.3.0",
  "org.webjars" % "angularjs" % "1.2.18",
  "org.webjars" % "bootstrap" % "3.1.1-2",
  "org.webjars" % "requirejs" % "2.1.14-1",
  "org.webjars" % "requirejs-domready" % "2.0.1-1",
  "org.webjars" % "angular-ui" % "0.4.0-3",
  "org.webjars" % "angular-ui-bootstrap" % "0.11.0-2",
  "org.webjars" % "angular-loading-bar" % "0.4.3",
  "org.scaldi" % "scaldi-play_2.10" % "0.3.3",
  "org.apache.jena" % "jena" % "2.11.2",
  "org.apache.jena" % "jena-arq" % "2.11.2",
  "com.typesafe.play" %% "play-slick" % "0.7.0",
  "com.newrelic.agent.java" % "newrelic-api" % "3.8.1"
)

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

pipelineStages := Seq(rjs, digest, gzip)
