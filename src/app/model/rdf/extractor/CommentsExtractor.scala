package model.rdf.extractor

import model.rdf.LocalizedValue
import model.rdf.sparql.query.CommentsQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}
import org.apache.jena.rdf.model.Literal

import scala.collection.JavaConversions._


class CommentsExtractor extends QueryExecutionResultExtractor[CommentsQuery, LocalizedValue] {

  case class StringLiteral(value: String, language: String)

  object StringLiteral {
    def create(literal: Literal) = {
      val lang = Option(literal.getLanguage).filter(_.trim.nonEmpty).getOrElse("nolang")
      StringLiteral(literal.getString, lang)
    }
  }

  case class RdfCommentResult(
                               rdfsComment : Option[StringLiteral],
                               dctDescription: Option[StringLiteral],
                               skosDefinition: Option[StringLiteral],
                               skosNote: Option[StringLiteral]
                             )

  val selectors: Seq[(RdfCommentResult => Option[StringLiteral])] = Seq(
    r => r.rdfsComment,
    r => r.dctDescription,
    r => r.skosDefinition,
    r => r.skosNote
  )

  override def extract(data: QueryExecution): Option[LocalizedValue] = {
    val result = data.execSelect().asInstanceOf[java.util.Iterator[QuerySolution]]

    val commentsResult = result.toList.map { qs =>
      RdfCommentResult(
        rdfsComment = Option(qs.get("rc")).map(_.asLiteral()).map(StringLiteral.create),
        dctDescription = Option(qs.get("dd")).map(_.asLiteral()).map(StringLiteral.create),
        skosDefinition = Option(qs.get("sd")).map(_.asLiteral()).map(StringLiteral.create),
        skosNote = Option(qs.get("sn")).map(_.asLiteral()).map(StringLiteral.create)
      )
    }

    val allLanguages = commentsResult.flatMap(r =>
      selectors.flatMap(s => s(r)).map(_.language)
    ).distinct

    val comments = allLanguages.map(l =>
      (l, findComment(l, commentsResult))
    )

    val map = comments.filter(_._2.isDefined).map {
      case (lang, maybeValue) => (lang, maybeValue.get.value)
    }

    map.isEmpty match {case false => Some(LocalizedValue.apply(map.toMap)) case _ => None}
  }

  private def findComment(language: String, available: Seq[RdfCommentResult]): Option[StringLiteral] = {
    selectors.flatMap(s => available.flatMap(r => s(r)).find(_.language == language)).headOption
  }
}
