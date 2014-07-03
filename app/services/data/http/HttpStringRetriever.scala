package services.data.http

import services.data.StringRetriever

import scala.io.Source

class HttpStringRetriever(val url: String, val accept: String = "", val encoding: String = "UTF-8") extends StringRetriever {
  private var _content: Option[String] = None

  def retrieve(): Option[String] = {
    val connection = new java.net.URL(url).openConnection()
    connection.setRequestProperty("Accept", accept)

    val inputStream = connection.getInputStream
    val result = Some(Source.fromInputStream(inputStream, encoding).mkString)

    inputStream.close()
    result
  }
}
