package model.rdf.extractor

trait RdfExtractor [InputType, OutputType] {

  def extract(input: InputType): Option[OutputType]

}
