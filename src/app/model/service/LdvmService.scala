package model.service

import java.io.File

import model.entity.{PipelineId, ComponentId}
import play.api.db.slick.{Session => SlickSession}

trait LdvmService {

  def fromRdf(ttlFile: File)(implicit session: SlickSession) : (Option[Seq[ComponentId]], Option[Seq[PipelineId]])

}
