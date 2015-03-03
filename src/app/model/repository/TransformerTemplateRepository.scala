package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class TransformerTemplateRepository extends CrudRepository[TransformerTemplateId, TransformerTemplate, TransformerTemplateTable](TableQuery[TransformerTemplateTable]){

  def findAllWithMandatoryDescriptors(implicit session: Session): Seq[SpecificComponentTemplate] = {
    (for {
      sct <- query
      ctf <- componentFeaturesQuery if ctf.componentTemplateId === sct.componentTemplateId
      f <- featuresQuery if f.isMandatory
      d <- descriptorsQuery if d.featureId === f.id
    } yield sct).list.distinct
  }
}
