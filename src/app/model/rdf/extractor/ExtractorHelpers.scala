package model.rdf.extractor

import model.rdf.vocabulary.SKOS
import org.apache.jena.rdf.model.{Property, Resource}
import org.apache.jena.vocabulary.{RDFS, DCTerms}

import scala.collection.JavaConversions._

import model.rdf.LocalizedValue

case class Descriptions(DCT_title: Option[LocalizedValue] = None, RDFS_label: Option[LocalizedValue] = None, RDFS_comment: Option[LocalizedValue] = None, DCT_description: Option[LocalizedValue] = None, SKOS_prefLabel: Option[LocalizedValue] = None)

object ExtractorHelpers {

  def extractDescriptions(resource: Resource) : Descriptions = {
    new Descriptions(
      ExtractorHelpers.getLocalizedLiteral(resource, DCTerms.title),
      ExtractorHelpers.getLocalizedLiteral(resource, RDFS.label),
      ExtractorHelpers.getLocalizedLiteral(resource, RDFS.comment),
      ExtractorHelpers.getLocalizedLiteral(resource, DCTerms.description),
      ExtractorHelpers.getLocalizedLiteral(resource, SKOS.prefLabel)
    )
  }

  def getLocalizedLiteral(resource: Resource, property: Property): Option[LocalizedValue] = {
    val list = resource.listProperties(property)

    if(list.isEmpty) {
      None
    }else{
      val l = new LocalizedValue
      list.foreach{ n =>
        l.put(Option(n.getLanguage).filter(_.trim.nonEmpty).getOrElse("nolang"), n.getString)
      }
      Some(l)
    }
  }

}
