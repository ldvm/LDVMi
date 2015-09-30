package model.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.query.{QueryExecution, QuerySolution}
import com.hp.hpl.jena.rdf.model.Literal
import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.datacube.DataCubeComponentValue
import model.rdf.sparql.datacube.query.DataCubeValuesQuery

import scala.collection.JavaConversions._


class DataCubeValuesExtractor extends QueryExecutionResultExtractor[DataCubeValuesQuery, Seq[DataCubeComponentValue]] {

  override def extract(data: QueryExecution): Option[Seq[DataCubeComponentValue]] = {

    val result = data.execSelect().asInstanceOf[java.util.Iterator[QuerySolution]]

    val map = result.toList.map { qs =>
      val o = qs.get("o")
      val uri = if (o.isResource) { Some(o.asResource().getURI) } else { None }
      val value = if (o.isLiteral) { Some(o.asLiteral()) } else { None }

      val l = Option(qs.get("l")).map(_.asLiteral())
      val spl = Option(qs.get("spl")).map(_.asLiteral())
      val sn = Option(qs.get("sn")).map(_.asLiteral())
      val sna = Option(qs.get("sna")).map(_.asLiteral())
      val st = Option(qs.get("st")).map(_.asLiteral())

      (uri, value, l, spl, sn, sna, st)
    }.groupBy(_._1)

    Some(map.map { case (maybeUri, labelsList) =>
      val labels = collectLabels(labelsList)
      DataCubeComponentValue(labels, maybeUri)
    }.toSeq)
  }

  private def collectLabels(labelsList: List[(Option[String], Option[Literal], Option[Literal], Option[Literal], Option[Literal], Option[Literal], Option[Literal])]): Option[LocalizedValue] = {
    val variants = labelsList.flatMap { case (_, value, l, spl, sn, sna, st) =>
      Seq(value, sn, l, spl, sna, st).collect {
        case Some(lp) => Option(lp.getLanguage).filter(_.trim.nonEmpty).getOrElse("nolang") -> lp.getString
      }
    }.toMap

    if (variants.nonEmpty) {
      Some(LocalizedValue(variants))
    } else {
      None
    }
  }
}
