package model.appgen.service

import java.io.{ByteArrayInputStream, ByteArrayOutputStream, ObjectInputStream, ObjectOutputStream}
import java.security.MessageDigest

import model.appgen.entity.{CacheEntry, User}
import model.appgen.repository.CacheEntriesRepository
import model.appgen.rest.RestRequest
import play.api.db.slick.Session
import play.api.libs.json.Json
import scaldi.{Injectable, Injector}
import play.api.mvc._
import utils._

/**
  * Very simple persistent cache for request Results. The values are stored serialized in the
  * database. Play Framework internally uses Ehcache which unfortunately offers real disk
  * persistence only in paid enterprise version.
  */
class ResultCacheService(implicit inj: Injector) extends Injectable {
  val cacheEntriesRepository = inject[CacheEntriesRepository]

  def set(request: RestRequest, result: Result)(implicit session: Session) = {
    val key = makeKey(request)
    serialize(result) map { value =>
      val entry = cacheEntriesRepository.findByKey(key).getOrElse(CacheEntry(None, key, ""))
      cacheEntriesRepository save entry.copy(value = value)
    }
  }

  def get(request: RestRequest)(implicit session: Session): Option[Result] = {
    val key = makeKey(request)
    cacheEntriesRepository.findByKey(key) flatMap { cacheEntry => deserialize(cacheEntry.value) }
  }

  private def makeKey(request: RestRequest): String = {
    val user = request.user match {
      case Some(user: User) => user.id.get
      case None => 0
    }
    val key = request.uri + "|user=" + user + "|body=" + Json.toJson(request.body)

    // Let's hash the key to reduce its size (faster indexing?)
    // TODO: store some meta-data (plain-text key, date etc) to the database as well
    MessageDigest.getInstance("MD5").digest(key.getBytes).map("%02x".format(_)).mkString
  }

  // Note: We use ISO-8859-1 as it is supposed to be bijective between chars and bytes and it
  // does not corrupt the data. Probably not the best solution ever, but it seems to work.
  // http://stackoverflow.com/questions/13568248/how-to-binary-deserialize-object-into-form-string

  private def serialize(result: Result): Option[String] = {
    try {
      val bo = new ByteArrayOutputStream()
      val so = new ObjectOutputStream(bo)
      new SerializableResult(result).writeExternal(so)
      so.flush()
      Some(bo.toString("ISO-8859-1"))
    } catch {
      case e: Throwable =>
        println("Unable to serialize Result: " + e.getMessage)
        e.printStackTrace()
        None
    }
  }

  private def deserialize(value: String): Option[Result] = {
    try {
      val b = value.getBytes("ISO-8859-1")
      val bi = new ByteArrayInputStream(b)
      val si = new ObjectInputStream(bi)

      val result = new SerializableResult()
      result.readExternal(si)
      Some(result.result)
    } catch {
      case e: Throwable =>
        println("Unable to deserialize  Result: " + e.getMessage)
        e.printStackTrace()
        None
    }
  }
}
