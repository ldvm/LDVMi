package services.data.rdf.sparql.datacube

import com.hp.hpl.jena.rdf.model.Property
import services.data.rdf.sparql.Vocabulary

object QB extends Vocabulary {

  override val PREFIX = "QB"
  override val PREFIX_URL = "http://purl.org/linked-data/cube#"

  lazy val DSD: Property = m.createProperty(PREFIX_URL, "DataStructureDefinition")

}
