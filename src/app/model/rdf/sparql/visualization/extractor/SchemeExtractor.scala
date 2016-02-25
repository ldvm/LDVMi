package model.rdf.sparql.visualization.extractor

import model.rdf.LocalizedValue
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.HierarchyNode
import model.rdf.sparql.visualization.query.SchemeQuery
import model.rdf.vocabulary.SKOS
import org.apache.jena.query.QueryExecution
import org.apache.jena.rdf.model.{Literal, Model, Resource}
import org.apache.jena.vocabulary.RDF
import scala.collection.JavaConversions._
import scala.collection.mutable

class SchemeExtractor(schemeUri: String) extends QueryExecutionResultExtractor[SchemeQuery, HierarchyNode] {

  private val conceptsByUri = new mutable.HashMap[String, HierarchyNode]
  private val hierarchyLinksByUri = new mutable.HashMap[String, Seq[String]]

  def extract(input: QueryExecution): Option[HierarchyNode] = {
    val model = input.execConstruct()
    val concepts = model.listSubjectsWithProperty(RDF.`type`, SKOS.Concept).toList
    val schemeResource = model.getResource(schemeUri)
    Some(buildHierarchy(schemeResource, concepts, model))
  }

  private def buildHierarchy(schemeResource: Resource, concepts: Seq[Resource], model: Model) : HierarchyNode = {
    val rootUris = concepts.flatMap { n =>
      val nodeResource = n.asResource()
      conceptsByUri.put(nodeResource.getURI, getNode(model, nodeResource))

      val broaderNodeResource = nodeResource.getPropertyResourceValue(SKOS.broader)
      val maybeBroader = Option(broaderNodeResource)

      maybeBroader.foreach { b =>
        hierarchyLinksByUri.put(b.getURI, hierarchyLinksByUri.getOrElse(b.getURI, Seq()) ++ Seq(nodeResource.getURI))
      }

      maybeBroader.isDefined match {
        case true => None
        case false => Some(nodeResource.getURI)
      }
    }

    val roots = rootUris.flatMap(buildSubtree)

    val maybeResource = Option(schemeResource)
    val labels = maybeResource.map(r => r.listProperties(SKOS.prefLabel).toSeq.map(l => l.getLiteral)).getOrElse(Seq())

    val schemeLabel = labels.size match {
      case 0 => LocalizedValue.create(("nolang", schemeUri.split("[/#]").lastOption.getOrElse(schemeUri)))
      case _ => LocalizedValue.create(labels)
    }

    HierarchyNode(schemeLabel, schemeUri, Some(1), Some(roots))
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

  private def getNode(model: Model, nodeResource: Resource) : HierarchyNode = {
    val nameNodes = model.listObjectsOfProperty(nodeResource, SKOS.prefLabel).toSeq.map(o => o.asLiteral())
    val name = nameNodes.size match {
      case 0 => LocalizedValue.create(("nolang", nodeResource.getURI))
      case _ => LocalizedValue.create(nameNodes)
    }

    val value = model.getProperty(nodeResource, RDF.value)
    val intValue = Option(value).map(_.getInt)
    HierarchyNode(name, nodeResource.getURI, if(intValue.isDefined){ intValue } else { Some(1) })
  }

  private def buildSubtree(rootUri: String): Option[HierarchyNode] = {

    val maybeConceptNode = conceptsByUri.get(rootUri)
    maybeConceptNode.map { n =>

      val maybeChildrenList = hierarchyLinksByUri.get(rootUri)
      val maybeChildren = maybeChildrenList.map { childrenList =>
        childrenList.map(buildSubtree).collect { case Some(t) => t }
      }

      val size = if(maybeChildren.isEmpty) { Some(1) } else { None }
      HierarchyNode(n.name, n.uri, size, maybeChildren)
    }

  }
}
