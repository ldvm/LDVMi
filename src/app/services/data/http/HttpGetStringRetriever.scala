package services.data.http

import services.data.StringRetriever

import scalaj.http.{Http, HttpOptions}

class HttpGetStringRetriever(val url: String, val params: List[(String, String)], val accept: String = "", val encoding: String = "UTF-8") extends StringRetriever {

  def retrieve(): Option[String] = {
    val queryObj = Http
      .get(url)
      .option(HttpOptions.readTimeout(Int.MaxValue))
      .option(HttpOptions.connTimeout(20*1000))
      .params(params)
      .header("Accept", accept)

    Some (queryObj.asString)
  }
}
