import play.PlayScala
import com.typesafe.sbt.SbtNativePackager._
import NativePackagerKeys._
import com.typesafe.sbt.packager.archetypes.ServerLoader.SystemV

name := "LinkedPipes Visualization"

version := "1.1.1"

/** Debian packaging **/
maintainer in Linux := "Jiri Helmich <helmich@ksi.mff.cuni.cz>"

packageSummary in Linux := "LinkedPipes Visualization - Linked Data visualizations"

packageDescription := "LinkedPipes Visualization - Linked Data visualizations"

serverLoading in Debian := SystemV

debianPackageDependencies ++= Seq("openjdk-7-jre-headless")

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.4"

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
  "org.webjars" %% "webjars-play" % "2.3.0-2",
  "org.webjars" % "angularjs" % "1.2.24",
  "org.webjars" % "bootstrap" % "3.2.0",
  "org.webjars" % "requirejs-domready" % "2.0.1-2",
  "org.webjars" % "angular-ui" % "0.4.0-3",
  "org.webjars" % "angular-ui-bootstrap" % "0.12.0",
  "org.webjars" % "angular-loading-bar" % "0.5.1",
  "org.webjars" % "underscorejs" % "1.6.0-3",
  "org.webjars" % "underscore.string" % "2.3.3",
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
  "org.scalaj" %% "scalaj-http" % "2.2.1",
  "org.scaldi" % "scaldi-play_2.11" % "0.4.1",
  "org.virtuslab" %% "unicorn-play" % "0.6.2",
  "org.apache.jena" % "jena" % "3.0.0",
  "org.apache.jena" % "jena-arq" % "3.0.0",
  "com.typesafe.play" %% "play-slick" % "0.8.0",
  "com.newrelic.agent.java" % "newrelic-api" % "3.25.0",
  "joda-time" % "joda-time" % "2.8.1",
  "org.joda" % "joda-convert" % "1.6",
  "com.github.tototoshi" %% "slick-joda-mapper" % "1.2.0",
  "com.vividsolutions" % "jts" % "1.8",
  "org.webjars" % "proj4js" % "2.2.1",
  "org.webjars" % "openlayers" % "3.4.0",
  "org.webjars" % "codemirror" % "5.0",
  "org.webjars" % "ui-codemirror" % "0.1.5",
  "org.webjars" % "bootstrap-growl" % "2.0.1",
  "org.webjars" % "flot" % "0.8.3",
  "org.mindrot" % "jbcrypt" % "0.3m"
)

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

pipelineStages := Seq(gzip)

// Custom task that compiles appgen JavaScript frontend (React) files using webpack. The simplest
// way is to execute it as an external command (it's probably not going to work on Windows machines
// but whatever).
lazy val buildAppgenJs = taskKey[Unit]("Build appgen JavaScript frontend")

buildAppgenJs := {
  println("Building appgen JavaScript frontend...")
  "npm install" #&& "npm update" #&& "npm run appgen-build" !
}

stage <<= stage dependsOn buildAppgenJs

dist <<= dist dependsOn buildAppgenJs

lazy val printWebpackWarning = taskKey[Unit]("Print Webpack warning")

printWebpackWarning := {
  println("You're in dev mode. Run 'npm run appgen-dev' to start Webpack server for frontend development of the application generator.")
}

run in Compile <<= run in Compile dependsOn printWebpackWarning
