package services.data.rdf.sparql.datacube.extractor

import com.hp.hpl.jena.rdf.model.ModelFactory
import com.hp.hpl.jena.vocabulary.{RDFS, RDF}
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
    val iterator = dataset.getDefaultModel.listSubjectsWithProperty(RDF.`type`, model.createResource(QB.DSD.getURI)) //this does not work

    iterator.toList.map { dsdResource =>

      val label = dsdResource.getProperty(RDFS.label)

      new DataCubeDataStructure(dsdResource.getURI, label = Some(label.getString))
    }
  }
}
