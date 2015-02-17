package model.service

import model.entity.ComponentType.ComponentType
import model.entity._
import model.repository.ComponentTemplateRepository
import play.api.db.slick._

trait ComponentService extends CrudService[ComponentTemplateId, ComponentTemplate, ComponentTemplateTable, ComponentTemplateRepository] {

  def getAllByType(implicit session: Session): Map[ComponentType, Seq[SpecificComponentTemplate]]

  def save(component: model.dto.ComponentTemplate)(implicit session: Session): ComponentTemplateId

  def save(components: Seq[model.dto.ComponentTemplate])(implicit session: Session): Seq[ComponentTemplateId] = {
    components.map(save)
  }

  def saveAnalyzer(analyzer: AnalyzerTemplate)(implicit session: Session): AnalyzerTemplateId

  def saveVisualizer(visualizer: VisualizerTemplate)(implicit session: Session): VisualizerTemplateId

  def saveTransformer(transformer: TransformerTemplate)(implicit session: Session): TransformerTemplateId

  def saveDataSource(dataSource: DataSourceTemplate)(implicit session: Session): DataSourceTemplateId

  def getByUri(uri: String)(implicit session: Session): Option[ComponentTemplate]

  def getConcreteComponentByInstance(concreteInstance: model.dto.ConcreteComponentInstance)(implicit session: Session): Option[SpecificComponentTemplate]

  def saveMembers(boundInstances: model.dto.BoundComponentInstances)(implicit session: Session) :  (DataPortBindingSetId, Map[String, ComponentInstanceId])

}
