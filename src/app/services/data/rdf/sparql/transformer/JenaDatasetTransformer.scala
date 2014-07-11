package services.data.rdf.sparql.transformer

import java.io.ByteArrayInputStream

import com.hp.hpl.jena.query.{DatasetFactory, Dataset}
import org.apache.jena.riot.RDFDataMgr
import services.data.rdf.sparql.{SparqlResult, SparqlResultTransformer}
import services.data.rdf.sparql.jena.JenaLang
import org.apache.jena.riot.Lang
import scala.reflect.runtime.universe._


abstract class JenaDatasetTransformer[D <: JenaLang](implicit tag: TypeTag[D]) extends SparqlResultTransformer[D, Dataset] {

  def transform(data: SparqlResult[D]): Dataset = {
    try {
      val dataInputStream = new ByteArrayInputStream(data.stringValue.getBytes("UTF-8"))

      val dataSet = DatasetFactory.createMem()
      RDFDataMgr.read(dataSet, dataInputStream, getLang)
      dataSet
    } catch {
      case e: org.apache.jena.riot.RiotException => throw new IllegalArgumentException("Transformation failed, data format mismatch: " + data.stringValue.substring(0, 500))
      case e: Exception => throw new IllegalArgumentException(e.getMessage)
    }
  }

  private def getLang : Lang = {
    tag.tpe.getClass.newInstance().asInstanceOf[D].get
  }

}
