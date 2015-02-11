package model.rdf

import java.io.{StringWriter, File, FileInputStream, StringReader}
import java.net.URL

import com.hp.hpl.jena.rdf.model.ModelFactory

case class Graph(jenaModel: com.hp.hpl.jena.rdf.model.Model) {

  def union(otherGraphOption: Option[Graph]): Graph = {
    otherGraphOption.map { otherGraph =>
      val newModel = ModelFactory.createDefaultModel()
      newModel.add(jenaModel)
      newModel.add(otherGraph.jenaModel)
      Graph(newModel)
    }.getOrElse(this)
  }

  def mergeWith(otherGraphOption: Option[Graph]): Unit = {
    otherGraphOption.map { otherGraph =>
      jenaModel.add(otherGraph.jenaModel)
    }
  }

  def toRdfXml: String = {
    val sw = new StringWriter()
    jenaModel.write(sw, "RDF/XML", null)
    sw.toString
  }

}

object Graph {

  private val defaultRdfLang = "N3"

  def apply(url: URL): Option[Graph] = {
    try {
      val model = ModelFactory.createDefaultModel()
      model.read(url.toExternalForm, null, defaultRdfLang)
      Some(Graph(model))
    } catch {
      case t: Throwable => None
    }
  }

  def apply(rdfOption: Option[String]): Option[Graph] = {
    rdfOption match {
      case None => None
      case Some(rdf) => Graph(rdf)
    }
  }

  def apply(rdf: String): Option[Graph] = {
    try {
      val jenaModel = ModelFactory.createDefaultModel()
      jenaModel.read(new StringReader(rdf), null, defaultRdfLang)
      Some(new Graph(jenaModel))
    } catch {
      case e: Throwable => None
    }
  }

  def apply(jenaModel: com.hp.hpl.jena.rdf.model.Model, lang: String = defaultRdfLang): Option[Graph] = {
    Some(new Graph(jenaModel))
  }

  def apply(file: File): Option[Graph] = {
    try {
      val jenaModel = ModelFactory.createDefaultModel()
      jenaModel.read(new FileInputStream(file), null, defaultRdfLang)
      Some(Graph(jenaModel))
    } catch {
      case e: Throwable => None
    }
  }
}
