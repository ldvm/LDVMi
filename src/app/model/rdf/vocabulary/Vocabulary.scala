package model.rdf.vocabulary

import com.hp.hpl.jena.rdf.model.{Model, ModelFactory}

trait Vocabulary {

  protected val PREFIX = ""
  protected val PREFIX_URL = ""

  protected lazy val m : Model = ModelFactory.createDefaultModel()

  def prefix = PREFIX
  def prefixUrl = PREFIX_URL

}
