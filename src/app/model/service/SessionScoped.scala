package model.service

import play.api.db
import play.api.db.slick._
import play.api.Play.current

trait SessionScoped {
  def withSession[T](action: Session => T): T = {
    val session = db.slick.DB.createSession()
    val result = action(session)
    session.close()
    result
  }
}
