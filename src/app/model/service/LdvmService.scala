package model.service

import java.io.File

import model.entity.{PipelineId, ComponentTemplateId}
import play.api.db.slick.{Session => SlickSession}

trait LdvmService {

  def fromRdf(ttlFile: File)(implicit session: SlickSession) : (Option[Seq[ComponentTemplateId]], Option[Seq[PipelineId]])

}
