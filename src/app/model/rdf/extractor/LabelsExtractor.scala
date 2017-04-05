package model.rdf.extractor

import model.rdf.LocalizedValue
import model.rdf.sparql.query.LabelsDereferenceQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}
import org.apache.jena.rdf.model.Literal

import scala.collection.JavaConversions._


class LabelsExtractor extends QueryExecutionResultExtractor[LabelsDereferenceQuery, LocalizedValue] {

    case class StringLiteral(value: String, language: String)

    object StringLiteral {
        def create(literal: Literal) = {
            val lang = Option(literal.getLanguage).filter(_.trim.nonEmpty).getOrElse("nolang")
            StringLiteral(literal.getString, lang)
        }
    }

    case class RdfLabelResult(
        rdfsLabel: Option[StringLiteral],
        skosPrefLabel: Option[StringLiteral],
        skosNotation: Option[StringLiteral],
        schemaName: Option[StringLiteral],
        schemaTitle: Option[StringLiteral],
        dctermsTitle: Option[StringLiteral],
        legalName: Option[StringLiteral]
    )

    val selectors: Seq[(RdfLabelResult => Option[StringLiteral])] = Seq(
        r => r.rdfsLabel,
        r => r.skosPrefLabel,
        r => r.schemaName,
        r => r.skosNotation,
        r => r.schemaTitle,
        r => r.dctermsTitle,
        r => r.legalName
    )

    override def extract(data: QueryExecution): Option[LocalizedValue] = {
        val result = data.execSelect().asInstanceOf[java.util.Iterator[QuerySolution]]

        val labelResults = result.toList.map { qs =>
            RdfLabelResult(
                rdfsLabel = Option(qs.get("l")).map(_.asLiteral()).map(StringLiteral.create),
                skosPrefLabel = Option(qs.get("spl")).map(_.asLiteral()).map(StringLiteral.create),
                skosNotation = Option(qs.get("sn")).map(_.asLiteral()).map(StringLiteral.create),
                schemaName = Option(qs.get("sna")).map(_.asLiteral()).map(StringLiteral.create),
                schemaTitle = Option(qs.get("st")).map(_.asLiteral()).map(StringLiteral.create),
                dctermsTitle = Option(qs.get("dct")).map(_.asLiteral()).map(StringLiteral.create),
                legalName = Option(qs.get("ln")).map(_.asLiteral()).map(StringLiteral.create)
            )
        }

        val allLanguages = labelResults.flatMap(r =>
            selectors.flatMap(s => s(r)).map(_.language)
        ).distinct

        val labels = allLanguages.map(l =>
            (l, findLabel(l, labelResults))
        )

        val map = labels.filter(_._2.isDefined).map {
            case (lang, maybeValue) => (lang, maybeValue.get.value)
        }

        map.isEmpty match {case false => Some(LocalizedValue.apply(map.toMap)) case _ => None}

    }

    private def findLabel(language: String, available: Seq[RdfLabelResult]): Option[StringLiteral] = {
        selectors.flatMap(s => available.flatMap(r => s(r)).find(_.language == language)).headOption
    }
}
