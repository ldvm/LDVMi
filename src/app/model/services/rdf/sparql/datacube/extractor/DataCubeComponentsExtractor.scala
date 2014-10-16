package model.services.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.{ModelFactory, Property, Resource, Statement}
import com.hp.hpl.jena.shared.PropertyNotFoundException
import com.hp.hpl.jena.vocabulary.RDF
import model.services.rdf.sparql.SparqlResult
import model.services.rdf.sparql.datacube._
import model.services.rdf.sparql.datacube.query.DataCubeComponentsQuery
import model.services.rdf.sparql.extractor.{Descriptions, ExtractorHelpers, SparqlResultExtractor}
import model.services.rdf.sparql.jena.JenaLangRdfXml
import model.services.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import model.services.rdf.vocabulary.QB

import scala.collection.JavaConversions._

class DataCubeComponentsExtractor extends SparqlResultExtractor[DataCubeComponentsQuery, JenaLangRdfXml, Seq[DataCubeComponent]] {

  val transformer = new RdfXmlJenaModelTransformer

  private lazy val model = ModelFactory.createDefaultModel

  def extract(data: SparqlResult[JenaLangRdfXml]): Seq[DataCubeComponent] = {
    val dataset = transformer.transform(data)
    val iterator = dataset.getDefaultModel.listSubjectsWithProperty(RDF.`type`, model.createResource(QB.dataStructureDefinition.getURI))

    iterator.toList.map { resource =>
        extractComponents(resource)
    }.flatten
  }

  private def extractComponents(dataStructure: Resource): Seq[DataCubeComponent] = {
    val iterator = dataStructure.listProperties(QB.component)
    iterator.map { node =>
      val component = node.getResource
      val descriptions = ExtractorHelpers.extractDescriptions(component)

      new DataCubeComponent(
        component.getURI,
        getDimension(component),
        getMeasure(component),
        getAttribute(component),
        order = getOrder(component),
        descriptions.DCT_title,
        descriptions.RDFS_label,
        descriptions.RDFS_comment,
        descriptions.DCT_description,
        descriptions.SKOS_prefLabel
      )
    }.toSeq
  }

  private def getDimension(component: Resource): Option[DataCubeDimensionProperty] = {
    getComponentProperty(component, QB.dimension) { case (d, s) =>

      Some(new DataCubeDimensionProperty(
        s.getResource.getURI,
        title = d.DCT_title,
        comment = d.RDFS_comment,
        label = d.RDFS_label,
        prefLabel = d.SKOS_prefLabel,
        conceptUri = getConcept(component)
      ))
    }
  }

  private def getMeasure(component: Resource): Option[DataCubeMeasureProperty] = {
    getComponentProperty(component, QB.measure) { case (d, s) =>

      Some(new DataCubeMeasureProperty(
        s.getResource.getURI,
        title = d.DCT_title,
        comment = d.RDFS_comment,
        label = d.RDFS_label,
        prefLabel = d.SKOS_prefLabel,
        conceptUri = getConcept(component),
        rangeUri = getRange(component)
      ))
    }
  }

  private def getAttribute(component: Resource): Option[DataCubeAttributeProperty] = {
    getComponentProperty(component, QB.attribute) { case (d, s) =>
      Some(new DataCubeAttributeProperty(
        s.getResource.getURI,
        title = d.DCT_title,
        comment = d.RDFS_comment,
        label = d.RDFS_label,
        prefLabel = d.SKOS_prefLabel,
        conceptUri = getConcept(component)
      ))
    }
  }

  private def getOrder(component: Resource): Option[Int] = {
    try {
      Option(component.getProperty(QB.order)).map(_.getInt)
    } catch {
      case e: PropertyNotFoundException => None
    }
  }

  private def getConcept(componentProperty: Resource): Option[String] = {
    try {
      Option(componentProperty.getProperty(QB.concept)).map(_.getResource.getURI)
    } catch {
      case e: PropertyNotFoundException => None
    }
  }

  private def getRange(componentProperty: Resource): Option[String] = {
    try {
      Option(componentProperty.getProperty(QB.concept)).map(_.getResource.getURI)
    } catch {
      case e: PropertyNotFoundException => None
    }
  }

  private def getComponentProperty[D](component: Resource, property: Property)
                                     (extractor: (Descriptions, Statement) => Option[D]): Option[D] = {

    val componentProperty = component.getProperty(property)
    Option(componentProperty).map { c =>
      val descriptions = ExtractorHelpers.extractDescriptions(c.getResource)
      extractor(descriptions, c)
    }.flatten
  }

  override def getLang: JenaLangRdfXml = transformer.getLang

}
