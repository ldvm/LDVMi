package model.repositories

/*
class VisualizationQueriesServiceImpl extends VisualizationQueriesService {

  override val tableReference = TableQuery[VisualizationQueriesTable]
  //val visualizations = TableQuery[InputBinding]

  def findByIdAndToken(id: Long, token: String)(implicit s: Session): Option[VisualisationQuery] = {
    tableReference.filter(v => v.visualizationId === id && v.token === token).firstOption
  }

  def getByIdWithEager(id: Long)(implicit s: Session): Option[VisualizationQueryEagerBox] = {
    /*(for {
      (vq, v) <- tableReference innerJoin visualizations on (_.visualizationId === _.id)
    } yield (vq, v)).firstOption.map((VisualizationQueryEagerBox.apply _).tupled)*/
    None
  }

  def listWithEager(skip: Int, take: Int)(implicit s: Session): Seq[VisualizationQueryEagerBox] = {
    /*(for {
      (vq, v) <- tableReference innerJoin visualizations on (_.visualizationId === _.id)
    } yield (vq, v)).list.map((VisualizationQueryEagerBox.apply _).tupled)*/
    List()
  }

  def deleteByToken(token: String)(implicit s: Session) = {
    tableReference.filter(_.token === token).delete
  }
}
*/