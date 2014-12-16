package model.service

import model.entity._
import model.repository.ComponentRepository
import play.api.db.slick._

trait ComponentService extends CrudService[ComponentId, Component, ComponentTable, ComponentRepository] {

  def save(component: model.dto.Component)(implicit session: Session): ComponentId

  def saveAnalyzer(analyzer: Analyzer)(implicit session: Session): AnalyzerId

  def saveVisualizer(visualizer: Visualizer)(implicit session: Session): VisualizerId

  def saveTransformer(transformer: Transformer)(implicit session: Session): TransformerId

  def saveDataSource(dataSource: DataSource)(implicit session: Session): DataSourceId

  def getByUri(uri: String)(implicit session: Session): Option[Component]

  def getConcreteComponentByInstance(concreteInstance: model.dto.ConcreteComponentInstance)(implicit session: Session): Option[ConcreteComponent]

}
