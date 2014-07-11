package services.data.http

import java.io.IOException

import services.data.StringRetriever

import scala.io.Source

class HttpStringRetriever(val url: String, val accept: String = "", val encoding: String = "UTF-8") extends StringRetriever {

  def retrieve(): Option[String] = {

    val connection = new java.net.URL(url).openConnection()
    connection.setRequestProperty("Accept", accept)

    val inputStream = connection.getInputStream
    val result = Some(Source.fromInputStream(inputStream, encoding).mkString)

    inputStream.close()
    result
  }
}
