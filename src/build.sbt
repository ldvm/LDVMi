import play.PlayScala
import com.typesafe.sbt.SbtNativePackager._
import NativePackagerKeys._
import com.typesafe.sbt.packager.archetypes.ServerLoader.SystemV

name := "LDVMi"

version := "1.1.0"

/** Debian packaging **/
maintainer in Linux := "Jiri Helmich <helmich@ksi.mff.cuni.cz>"

packageSummary in Linux := "LDVMi - Linked Data visualizations"

packageDescription := "LDVMi - Linked Data visualizations"

serverLoading in Debian := SystemV

debianPackageDependencies ++= Seq("openjdk-7-jre-headless")

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

resolvers ++= Seq(
  Resolver.sonatypeRepo("releases"),
  Resolver.sonatypeRepo("snapshots")
)

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  filters,
  "com.typesafe.slick" %% "slick" % "2.1.0",
  "org.webjars" %% "webjars-play" % "2.3.0-3",
  "org.webjars" % "angularjs" % "1.2.24",
  "org.webjars" % "bootstrap" % "3.2.0",
  "org.webjars" % "requirejs-domready" % "2.0.1-2",
  "org.webjars" % "angular-ui" % "0.4.0-3",
  "org.webjars" % "angular-ui-bootstrap" % "0.12.0",
  "org.webjars" % "angular-loading-bar" % "0.5.1",
  "org.webjars" % "underscorejs" % "1.6.0-3",
  "org.webjars" % "highcharts" % "4.0.3",
  "org.webjars" % "highcharts-ng" % "0.0.6",
  "org.webjars" % "ng-table" % "0.3.3",
  "org.webjars" % "jquery" % "2.1.1",
  "org.webjars" % "angular-moment" % "0.8.2",
  "org.webjars" % "momentjs" % "2.8.3",
  "org.webjars" % "nervgh-angular-file-upload" % "1.1.5-1",
  "org.webjars" % "d3js" % "3.5.2",
  "org.webjars" % "angular-nvd3" % "0.0.9",
  "org.webjars" % "nvd3" % "8415ee55d3",
  "org.webjars" % "angularjs-nvd3-directives" % "0.0.7-1",
  "org.scalaj" %% "scalaj-http" % "0.3.16",
  "org.scaldi" % "scaldi-play_2.11" % "0.4.1",
  "org.virtuslab" %% "unicorn-play" % "0.6.2",
  "org.apache.jena" % "jena" % "2.13.0",
  "org.apache.jena" % "jena-arq" % "2.13.0",
  "com.typesafe.play" %% "play-slick" % "0.8.0",
  "com.newrelic.agent.java" % "newrelic-api" % "3.8.1",
  "joda-time" % "joda-time" % "2.4",
  "org.joda" % "joda-convert" % "1.6",
  "com.github.tototoshi" %% "slick-joda-mapper" % "1.2.0",
  "com.vividsolutions" % "jts" % "1.8",
  "org.webjars" % "proj4js" % "2.2.1",
  "org.webjars" % "openlayers" % "3.4.0",
  "org.webjars" % "codemirror" % "5.0",
  "org.webjars" % "ui-codemirror" % "0.1.5",
  "org.webjars" % "bootstrap-growl" % "2.0.1",
  "org.webjars" % "flot" % "0.8.3"
)

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

//pipelineStages := Seq(rjs, digest, gzip)
