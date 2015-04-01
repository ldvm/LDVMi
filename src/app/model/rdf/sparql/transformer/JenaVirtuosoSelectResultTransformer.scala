package model.rdf.sparql.transformer

/*
class JenaVirtuosoSelectResultTransformer extends SparqlResultTransformer[JenaLangTtl, Seq[SparqlResultSet]] {
  override def getLang: JenaLangTtl = new JenaLangTtl

  override def transform(data: SparqlResult[JenaLangTtl]): Seq[SparqlResultSet] = {
    val defaultTransformer = new TtlJenaModelTransformer
    val dataset = defaultTransformer.transform(data)

    val iterator = dataset.getDefaultModel.listSubjectsWithProperty(RDF.`type`, SPARQL.resultSet)
    iterator.map { rs =>
      val variables = rs.listProperties(SPARQL.resultVariable).map(_.getString).toList
      val solutions = rs.listProperties(SPARQL.solution).map { solution =>
        val map = solution.getResource.listProperties(SPARQL.binding).map { binding =>
          val variable = binding.getProperty(SPARQL.variable)
          val value = binding.getProperty(SPARQL.value)
          variable.getString -> getValue(value)
        }.toMap
        new SparqlResultSolution(map)
      }.toSeq

      new SparqlResultSet(variables, solutions)
    }.toList
  }

  def getValue(valueStatement: Statement): Any = {

    if (valueStatement.getObject.isLiteral) {
      valueStatement.getLiteral.getValue
    } else {
      (List("uri" -> valueStatement.getResource.getURI) ++ valueStatement.getResource. listProperties().map { p =>
        p.getPredicate.getURI -> getValue(p)
      }).toMap
    }
  }
}
*/