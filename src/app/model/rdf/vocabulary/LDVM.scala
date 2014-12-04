package model.rdf.vocabulary

object LDVM extends Vocabulary {

  override val PREFIX = "ldvm"
  override val PREFIX_URL = "http://linked.opendata.cz/ontology/ldvm/"

  lazy val componentTemplate = m.createResource(PREFIX_URL + "ComponentTemplate")
  lazy val pipeline = m.createResource(PREFIX_URL + "Pipeline")
  lazy val mandatoryFeature = m.createResource(PREFIX_URL + "MandatoryFeature")
  lazy val componentConfigurationTemplate = m.createProperty(PREFIX_URL, "componentConfigurationTemplate")
  lazy val inputTemplate = m.createProperty(PREFIX_URL, "inputTemplate")
  lazy val feature = m.createProperty(PREFIX_URL, "feature")
  lazy val signature = m.createProperty(PREFIX_URL, "signature")
  lazy val query = m.createProperty(PREFIX_URL, "query")
  lazy val appliesTo = m.createProperty(PREFIX_URL, "appliesTo")
  lazy val outputTemplate = m.createProperty(PREFIX_URL, "outputTemplate")
  lazy val outputDataSample = m.createProperty(PREFIX, "outputDataSample")

}
