package model.mess

class VisualizationServiceImpl extends VisualizationService {
  /*
    override val tableReference = TableQuery[InputBinding]
    val dataSources = TableQuery[DataSourcesTable]
    val visualizationQueries = TableQuery[VisualizationQueriesTable]

    def getByIdWithEager(id: Long)(implicit s: Session): Option[VisualizationEagerBox] = {
      (for {
        ((v, d), vq) <- tableReference
          .filter(_.id === id)
          .take(1) innerJoin dataSources on (_.datasourceId === _.id) leftJoin visualizationQueries on (_._1.id === _.visualizationId)
      } yield (v, d, vq.token.?)).firstOption.map((VisualizationEagerBox.apply _).tupled)
    }

    def listWithEager(skip: Int, take: Int)(implicit s: Session): Seq[VisualizationEagerBox] = {

      val visualizationsWithSources = (for {
        v <- tableReference
        d <- dataSources if v.datasourceId === d.id
      } yield (v, d)).sortBy{ case (v,_) =>
        (v.modifiedUtc.desc, v.createdUtc.desc)
      }.drop(skip).take(take)

      val recentQueries = (for {
        vq <- visualizationQueries
      } yield vq)
        .groupBy(_.visualizationId)
        .map {
          case (visualizationId, group) => (
              visualizationId,
              group.map(_.id).max
            )
        }

      val withQueryIds = for {
        vb <- visualizationsWithSources leftJoin recentQueries on (_._1.id === _._1)
      } yield (vb._1, vb._2._2)

      val withTokens = for {
        r <- withQueryIds leftJoin visualizationQueries on (_._2 === _.id)
      } yield (r._1._1._1, r._1._1._2, r._2.token.?)

      withTokens.list.map((VisualizationEagerBox.apply _).tupled)
    }*/

}
