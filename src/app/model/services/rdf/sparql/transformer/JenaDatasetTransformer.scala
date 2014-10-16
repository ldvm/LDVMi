package model.services.rdf.sparql.transformer


import play.api.Logger
import java.io.ByteArrayInputStream

import com.hp.hpl.jena.query.{DatasetFactory, Dataset}
import org.apache.jena.riot.RDFDataMgr
import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.jena.JenaLang

abstract class JenaDatasetTransformer[D <: JenaLang] extends SparqlResultTransformer[D, Dataset] {

  def transform(data: SparqlResult[D]): Dataset = {
    try {
      val dataInputStream = new ByteArrayInputStream(data.stringValue.getBytes("UTF-8"))

      val dataSet = DatasetFactory.createMem()
      RDFDataMgr.read(dataSet, dataInputStream, getLang.get)
      dataSet
    } catch {
      case e: org.apache.jena.riot.RiotException => {
        Logger.error("Jena Riot loader failed", e)
        throw new IllegalArgumentException("Transformation failed, data format mismatch: " + data.stringValue.substring(0, Math.min(data.stringValue.length, 500)))
      }
      case e: Exception => throw new IllegalArgumentException(e.getMessage)
    }
  }

}
