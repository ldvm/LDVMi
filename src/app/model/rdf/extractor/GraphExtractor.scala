package model.rdf.extractor


import model.rdf.Graph
import model.rdf.vocabulary.SKOS
import org.apache.jena.rdf.model.{Property, Resource}
import org.apache.jena.vocabulary.{RDFS, DCTerms}

trait GraphExtractor[OutputType] extends RdfExtractor[Graph, OutputType] {

  protected def getLabel(r: Resource): Option[String] = {
    val possibleLabels = Seq(DCTerms.title, RDFS.label, SKOS.prefLabel)
    possibleLabels.find(r.hasProperty).map(r.getProperty).map(_.getString)
  }

  protected def getLiteralPropertyString(r: Resource, p: Property): Option[String] = {
    r.hasProperty(p) match {
      case true => Some(r.getProperty(p).getString)
      case _ => None
    }
  }

}