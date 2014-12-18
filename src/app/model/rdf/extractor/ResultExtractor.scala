package model.rdf.extractor

import model.rdf.sparql.query.SparqlQuery

trait ResultExtractor[Q <: SparqlQuery, InputType, OutputType] extends RdfExtractor[InputType, OutputType]
