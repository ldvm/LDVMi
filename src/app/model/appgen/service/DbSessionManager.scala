package model.appgen.service
import play.api.db
import play.api.Play.current
import play.api.db.slick.Session
import scaldi.Injectable

// Deprecated, probably not a smart way to go.
class DbSessionManager extends Injectable {
  val session = db.slick.DB.createSession()
  def getSession: Session = session
}
