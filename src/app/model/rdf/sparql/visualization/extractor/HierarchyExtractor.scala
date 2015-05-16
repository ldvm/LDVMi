package model.rdf.sparql.visualization.extractor

import com.hp.hpl.jena.query.QueryExecution
import com.hp.hpl.jena.vocabulary.RDF
import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.visualization.HierarchyNode
import model.rdf.sparql.visualization.query.HierarchyQuery
import model.rdf.vocabulary.SKOS
import scala.collection.JavaConversions._
import scala.collection.mutable

class HierarchyExtractor extends QueryExecutionResultExtractor[HierarchyQuery, Seq[HierarchyNode]] {

  def extract(input: QueryExecution): Option[Seq[HierarchyNode]] = {

    val model = input.execConstruct()

    val nodes = model.listSubjectsWithProperty(RDF.`type`, SKOS.Concept).toList

    val nodesMap = new mutable.HashMap[String, HierarchyNode]
    val broaderMap = new mutable.HashMap[String, Seq[String]]

    val roots = nodes.flatMap { n =>

      val nodeResource = n.asResource()

      val name = model.getProperty(nodeResource, SKOS.prefLabel).getString
      val value = model.getProperty(nodeResource, RDF.value)
      val intValue = Option(value).map(_.getInt)
      val broader = nodeResource.getPropertyResourceValue(SKOS.broader)

      val node = HierarchyNode(name, if(intValue.isDefined){intValue}else{Some(1)})
      nodesMap.put(nodeResource.getURI, node)

      Option(broader).map{ b => broaderMap.put(b.getURI, broaderMap.getOrElse(b.getURI, Seq()) ++ Seq(nodeResource.getURI)) }

      Option(broader).flatMap(x => None).getOrElse(Some(nodeResource.getURI))

    }

    Some(roots.flatMap(u => tree(u, broaderMap, nodesMap)))
  }

  def tree(rootUri: String, broaderMap: mutable.HashMap[String, Seq[String]], nodesMap: mutable.HashMap[String, HierarchyNode])
  : Option[HierarchyNode] = {

    nodesMap.get(rootUri).map { n =>

      val maybeChildrenList = broaderMap.get(rootUri)
      val children = maybeChildrenList.map { childrenList =>
        childrenList.map { child =>
          tree(child, broaderMap, nodesMap)
        }.collect { case Some(t) => t }
      }

      HierarchyNode(n.name, if(children.isEmpty) { Some(1) }else{ None }, children)
    }

  }
}
