package model.services.rdf

import scala.collection.mutable

class LocalizedValue {

  private val languageMap = new mutable.HashMap[String, String]

  def put(language: String, localizedString: String) {
    languageMap.put(language, localizedString)
  }

  def get(language: String): Option[String] = {
    languageMap.get(language)
  }

  def getOrElse(language: String, defaultLanguage: String): Option[String] = {
    val primary = languageMap.get(language)
    if (primary.isDefined) {
      primary
    } else {
      languageMap.get(defaultLanguage)
    }
  }

  def getOrFirst(language: String): Option[String] = {
    val primary = languageMap.get(language)
    if (primary.isDefined) {
      primary
    } else {
      languageMap.headOption.map(_._2)
    }
  }

}

object LocalizedValue {

  def apply(variants: Map[String, String]) = {
    val l = new LocalizedValue
    variants.foreach { p =>
      l.put(p._1, p._2)
    }
    l
  }

  def unapply(l: LocalizedValue) : Option[Map[String, String]] = {
    if(l.languageMap.nonEmpty){
      Some(l.languageMap.toMap)
    }else{
      None
    }
  }

}
