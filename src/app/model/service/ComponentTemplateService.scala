package model.service

import model.entity.ComponentType.ComponentType
import model.entity._
import model.repository.ComponentTemplateRepository
import play.api.db.slick._

trait ComponentTemplateService extends CrudService[ComponentTemplateId, ComponentTemplate, ComponentTemplateTable, ComponentTemplateRepository] {

  def getAllByType(implicit session: Session): Map[ComponentType, Seq[SpecificComponentTemplate]]

  def getAllForDiscovery(maybeDs: Option[(String, Seq[String])] = None, combine: Boolean, name: Option[String] = None)(implicit session: Session): Map[ComponentType, Seq[SpecificComponentTemplate]]

  def save(component: model.dto.ComponentTemplate)(implicit session: Session): ComponentTemplateId

  def save(components: Seq[model.dto.ComponentTemplate])(implicit session: Session): Seq[ComponentTemplateId] = {
    components.map(save)
  }

  def delete(componentTemplate: ComponentTemplate)(implicit session: Session)

  def saveAnalyzer(analyzer: AnalyzerTemplate)(implicit session: Session): AnalyzerTemplateId

  def saveVisualizer(visualizer: VisualizerTemplate)(implicit session: Session): VisualizerTemplateId

  def saveTransformer(transformer: TransformerTemplate)(implicit session: Session): TransformerTemplateId

  def saveDataSource(dataSource: DataSourceTemplate)(implicit session: Session): DataSourceTemplateId

  def getByUri(uri: String)(implicit session: Session): Option[ComponentTemplate]

  def getConcreteComponentByInstance(concreteInstance: model.dto.ConcreteComponentInstance)(implicit session: Session): Option[SpecificComponentTemplate]

  def saveMembers(boundInstances: model.dto.BoundComponentInstances)(implicit session: Session) :  (DataPortBindingSetId, Map[String, ComponentInstanceId])

  def findSpecificIn(componentIds: Seq[ComponentTemplateId])(implicit session: Session) : Seq[SpecificComponentTemplate]

}
