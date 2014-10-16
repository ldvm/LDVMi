package model.services.rdf.sparql


class VariableGenerator {

  private var i = 0

  def next: VariableGenerator = {
    i += 1
    this
  }

  def getVariable = {
    "?" + getName
  }

  def getName = {
    "v" + i.toString
  }

}
