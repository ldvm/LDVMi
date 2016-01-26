package model.rdf.sparql.datacube.extractor

import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.datacube.query.LabelsDereferenceQuery
import org.apache.jena.query.{QueryExecution, QuerySolution}
import org.apache.jena.rdf.model.Literal

import scala.collection.JavaConversions._


class LabelsExtractor extends QueryExecutionResultExtractor[LabelsDereferenceQuery, LocalizedValue] {

  override def extract(data: QueryExecution): Option[LocalizedValue] = {
    val result = data.execSelect().asInstanceOf[java.util.Iterator[QuerySolution]]

    val map = result.toList.map { qs =>

      val l = Option(qs.get("l")).map(_.asLiteral())
      val spl = Option(qs.get("spl")).map(_.asLiteral())
      val sn = Option(qs.get("sn")).map(_.asLiteral())
      val sna = Option(qs.get("sna")).map(_.asLiteral())
      val st = Option(qs.get("st")).map(_.asLiteral())

      (l, spl, sn, sna, st)
    }.headOption

    map.flatMap(collectLabels)
  }

  private def collectLabels(labelsList: (Option[Literal], Option[Literal], Option[Literal], Option[Literal], Option[Literal])): Option[LocalizedValue] = {
    val variants = labelsList match {
      case (l, spl, sn, sna, st) => Some(Seq(sn, l, spl, sna, st).collect {
        case Some(lp) => Option(lp.getLanguage).filter(_.trim.nonEmpty).getOrElse("nolang") -> lp.getString
      })
      case _ => None
    }
    variants.map(v => LocalizedValue(v.toMap))
  }
}
