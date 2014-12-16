package model.rdf

import java.io.StringReader

import com.hp.hpl.jena.rdf.model.ModelFactory

case class Graph(jenaModel: com.hp.hpl.jena.rdf.model.Model) {
}

object Graph {

  def apply(rdfOption: Option[String]): Option[Graph] = {
    rdfOption match {
      case None => None
      case Some(rdf) => apply(rdf)
    }
  }

  def apply(rdf: String): Option[Graph] = {
    try {
      val jenaModel = ModelFactory.createDefaultModel()
      jenaModel.read(new StringReader(rdf), null, "N3")
      Some(new Graph(jenaModel))
    } catch {
      case e: Throwable => None
    }
  }
}
