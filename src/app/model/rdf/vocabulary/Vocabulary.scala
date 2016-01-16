package model.rdf.vocabulary

import org.apache.jena.rdf.model.{ModelFactory, Model}

trait Vocabulary {

  protected val PREFIX = ""
  protected val PREFIX_URL = ""

  protected lazy val m : Model = ModelFactory.createDefaultModel()

  def prefix = PREFIX
  def prefixUrl = PREFIX_URL

}
