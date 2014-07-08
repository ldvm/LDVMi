package services.data.rdf.sparql.datacube

case class DataCubeDataset(dataset: String, title: Option[String] = None, label: Option[String] = None, comment: Option[String] = None, description: Option[String] = None, publisher: Option[String] = None, issued: Option[String] = None)

object DataCubeDataset {

  def apply(jenaDataset: com.hp.hpl.jena.query.Dataset) = {
    new DataCubeDataset("s")
  }

}