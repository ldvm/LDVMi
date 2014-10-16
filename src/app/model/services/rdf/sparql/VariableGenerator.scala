package model.services.rdf.sparql


class VariableGenerator {

  private var i = 0

  def getVariable = {
    "?" + getName
  }

  def getName = {
    i += 1
    "v" + i.toString
  }

}
