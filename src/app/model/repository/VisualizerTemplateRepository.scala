package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class VisualizerTemplateRepository extends CrudRepository[VisualizerTemplateId, VisualizerTemplate, VisualizerTemplateTable](TableQuery[VisualizerTemplateTable]){

  def findAllWithMandatoryDescriptors(implicit session: Session): Seq[VisualizerTemplate] = {
    (for {
      sct <- query
      ctf <- componentFeaturesQuery if ctf.componentTemplateId === sct.componentTemplateId
      f <- featuresQuery if f.isMandatory && f.id === ctf.featureId
      d <- descriptorsQuery if d.featureId === f.id
    } yield sct).list.distinct
  }

  def findByComponentIds(ids: Seq[ComponentTemplateId])(implicit session: Session): Seq[SpecificComponentTemplate] = {
    (for {
      s <- query if s.componentTemplateId inSetBind ids
    } yield s).list
  }

  def findByUri(uri: String)(implicit session: Session): Option[VisualizerTemplate] = {
    (for {
      v <- query
      c <- componentTemplatesQuery if c.id === v.componentTemplateId && c.uri === uri
    } yield v).firstOption
  }
}
