package model.rdf.sparql

trait Pattern {

  def getWherePattern: String
  
  def getConstructPattern: String

}
