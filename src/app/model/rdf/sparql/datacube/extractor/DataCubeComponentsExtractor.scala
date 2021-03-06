package model.rdf.sparql.datacube.extractor

import model.rdf.extractor.{Descriptions, ExtractorHelpers, QueryExecutionResultExtractor}
import model.rdf.sparql.datacube._
import model.rdf.sparql.datacube.query.DataCubeComponentsQuery
import model.rdf.vocabulary.QB
import org.apache.jena.query.QueryExecution
import org.apache.jena.rdf.model.{Statement, Property, Resource}
import org.apache.jena.shared.PropertyNotFoundException
import org.apache.jena.vocabulary.RDF

import scala.collection.JavaConversions._

class DataCubeComponentsExtractor extends QueryExecutionResultExtractor[DataCubeComponentsQuery, Seq[DataCubeComponent]] {

  def extract(input: QueryExecution): Option[Seq[DataCubeComponent]] = {
    val componentResources = input.execConstruct().listSubjectsWithProperty(RDF.`type`, QB.dataStructureDefinition).toList
    Some(componentResources.flatMap { resource =>
      extractComponents(resource)
    })
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
    Option(componentProperty).flatMap { c =>
      val descriptions = ExtractorHelpers.extractDescriptions(c.getResource)
      extractor(descriptions, c)
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

}
