package com.typesafe.sbt.babel

import com.typesafe.sbt.jse.SbtJsTask
import com.typesafe.sbt.web.{GeneralProblem, CompileProblems, LineBasedProblem}
import sbt.Keys._
import sbt._
import xsbti.Severity

object Import {

  val babel = TaskKey[Seq[File]]("babel", "Run Babel compiler")

  object BabelKeys {
    val sourceFileNames = SettingKey[Seq[String]]("traceur-sources", "Files to compile. Should just be the 'root' modules, traceur will pull the rest. So for example if A.js requires B.js requires C.js, only list A.js here. Default javascripts/main.js")
    val outputFileNames = SettingKey[Seq[String]]("traceur-output", "Name of the output file. Default main.js")
  }

}

object SbtBabel extends AutoPlugin {

  override def requires = SbtJsTask

  override def trigger = AllRequirements

  val autoImport = Import

  import com.typesafe.sbt.jse.SbtJsEngine.autoImport.JsEngineKeys._
  import com.typesafe.sbt.jse.SbtJsTask.autoImport.JsTaskKeys._
  import com.typesafe.sbt.babel.Import.BabelKeys._
  import com.typesafe.sbt.babel.Import._
  import com.typesafe.sbt.web.Import.WebKeys._
  import com.typesafe.sbt.web.SbtWeb.autoImport._

  override def projectSettings = Seq(
    includeFilter in babel := GlobFilter("*.js"),
    sourceFileNames in babel in Assets := Seq("javascripts/main.js"),
    sourceFileNames in babel in TestAssets := Seq("javascript-tests/main.js"),
    outputFileNames in babel in Assets := Seq("main.js"),
    outputFileNames in babel in TestAssets := Seq("main-test.js"),
    babel in Assets := runBabel(Assets).dependsOn(webJarsNodeModules in Plugin).value,
    babel in TestAssets := runBabel(TestAssets).dependsOn(webJarsNodeModules in Plugin).value,
    resourceGenerators in Assets <+= babel in Assets,
    resourceGenerators in TestAssets <+= babel in TestAssets
  )

  def boolToParam(condition: Boolean, param: String): Seq[String] = {
    if (condition) Seq(param) else Seq()
  }

  private def runBabel(config: Configuration): Def.Initialize[Task[Seq[File]]] = Def.task {
    val sourceDir = (sourceDirectory in config).value
    val outputDir = (resourceManaged in config).value

    // Select all *.js files in the source directory (all might get compiled)
    val inputFileCandidates = (sourceDir ** (includeFilter in babel).value).get

    val sourceFiles = (sourceFileNames in babel in config).value
      .map(file => sourceDir / file).filter(_.exists)
    val outputFiles = (outputFileNames in babel in config).value
      .map(file => outputDir / file)
    val outputMapFiles = (outputFileNames in babel in config).value
      .map(file => outputDir / (file + ".map"))

    for ((sourceFile, outputFile) <- sourceFiles zip outputFiles) {
      try {
        SbtJsTask.executeJs(
          state.value,
          // For now Babel only works with node
          EngineType.Node,
          None,
          Nil,
          new File(".").getAbsoluteFile / "project" / "SbtBabel.js",
          Seq("--in", sourceFile.toString) ++ Seq("--out", outputFile.toString),
          (timeoutPerSource in babel).value * inputFileCandidates.size
        )
      } catch {
        case failure: SbtJsTask.JsTaskFailure => {
          val problem = new GeneralProblem(failure.toString, sourceFile)
          CompileProblems.report(reporter.value, Seq(problem))
        }
      }
    }

    outputFiles ++ outputMapFiles
  }
}