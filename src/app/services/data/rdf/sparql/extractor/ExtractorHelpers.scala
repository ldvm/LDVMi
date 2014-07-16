package services.data.rdf.sparql.extractor

import com.hp.hpl.jena.vocabulary.{RDFS, DCTerms}
import services.data.rdf.vocabulary.SKOS

import scala.collection.JavaConversions._

import com.hp.hpl.jena.rdf.model.{Property, Resource}
import services.data.rdf.LocalizedLiteral

case class Descriptions(DCT_title: Option[LocalizedLiteral] = None, RDFS_label: Option[LocalizedLiteral] = None, RDFS_comment: Option[LocalizedLiteral] = None, DCT_description: Option[LocalizedLiteral] = None, SKOS_prefLabel: Option[LocalizedLiteral] = None)

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

  def getLocalizedLiteral(resource: Resource, property: Property): Option[LocalizedLiteral] = {
    val list = resource.listProperties(property)

    if(list.isEmpty) {
      None
    }else{
      val l = new LocalizedLiteral
      list.foreach{ n =>
        l.put(n.getLanguage, n.getString)
      }
      Some(l)
    }
  }

}
