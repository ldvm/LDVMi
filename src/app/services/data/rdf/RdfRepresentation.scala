package services.data.rdf

object RdfRepresentation extends Enumeration
{
  type Type = Value

  val RdfXml, Turtle, Trig = Value
}
