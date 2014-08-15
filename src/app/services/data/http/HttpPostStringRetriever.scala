package services.data.http

import services.data.StringRetriever

import scalaj.http.Http
import scalaj.http.HttpOptions

class HttpPostStringRetriever(val url: String, val params: List[(String, String)], val accept: String = "", val encoding: String = "UTF-8") extends StringRetriever {

  def retrieve(): Option[String] = {
    Some(
      Http.post(url).option(HttpOptions.readTimeout(Int.MaxValue)).params(params)
      .header("Accept-Encoding","compress, gzip")
      .header("Accept", accept)
      .asString
    )
  }
}
