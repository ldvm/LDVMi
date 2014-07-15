package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.{Resource, Property, ModelFactory}
import com.hp.hpl.jena.vocabulary.{RDFS, RDF}
import services.data.rdf.LocalizedLiteral
import services.data.rdf.sparql.datacube.DataCubeDataStructure
import services.data.rdf.sparql.datacube.query.DataCubeDataStructuresQuery
import services.data.rdf.sparql.jena.JenaLangRdfXml
import services.data.rdf.sparql.transformer.RdfXmlJenaModelTransformer
import services.data.rdf.sparql.{SparqlResult, SparqlResultExtractor}
import services.data.rdf.sparql.datacube.QB
import scala.collection.JavaConversions._

class DataCubeDataStructuresExtractor extends SparqlResultExtractor[DataCubeDataStructuresQuery, JenaLangRdfXml, Seq[DataCubeDataStructure]] {

  val transformer = new RdfXmlJenaModelTransformer

  private lazy val model = ModelFactory.createDefaultModel

  def extract(data: SparqlResult[JenaLangRdfXml]): Seq[DataCubeDataStructure] = {
    val dataset = transformer.transform(data)
    val iterator = dataset.getDefaultModel.listSubjectsWithProperty(RDF.`type`, model.createResource(QB.DSD.getURI))

    iterator.toList.map { dsdResource =>
      val label = _getLocalizedLiteral(dsdResource, RDFS.label)
      val comment = _getLocalizedLiteral(dsdResource, RDFS.comment)

      new DataCubeDataStructure(dsdResource.getURI, label = label, comment = comment)
    }
  }

  private def _getLocalizedLiteral(node: Resource, property: Property): Option[LocalizedLiteral] = {
    val list = node.listProperties(property)
    if(!list.nonEmpty) {
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
