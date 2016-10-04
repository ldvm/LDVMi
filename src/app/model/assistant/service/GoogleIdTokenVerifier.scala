package model.assistant.service
import play.api.libs.json.Json
import scaldi.{Injectable, Injector}
import play.api.Play.current

// Based on:
case class VerifiedToken(
  iss: String, sub: String, azp: String, aud: String, iat: String, exp: String,
  email: String,
  name: String,
  picture: String,
  given_name: String,
  family_name: String,
  locale: String
)

class GoogleIdTokenVerifier(implicit inj: Injector) extends Injectable {

  /**
    * Verify Google Sign-In authentication token.
    * @see https: //developers.google.com/identity/sign-in/web/backend-auth#calling-the-tokeninfo-endpoint
    * @param token token obtained with the client authentication library
    * @return If the token is valid, an object containing base user information will be returned.
    */
  def verify(token: String): Option[VerifiedToken] = {
    try {
      // Make a HTTPS request to Google services to verify the token
      val url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token
      val json = scala.io.Source.fromURL(url).mkString

      // Parse the response from JSON
      implicit val verifiedTokenReads = Json.reads[VerifiedToken]
      Json.parse(json).validate[VerifiedToken].fold(
        errors => { println(errors); None },
        verifiedToken => {

          // Make sure that the client ID is correct
          current.configuration.getString("google.clientId") match {
            case Some(verifiedToken.aud) => Some(verifiedToken)
            case _ => println("Invalid Google Client ID"); None
          }
        }
      )
    } catch {
      case ioe: java.io.IOException => println(ioe); None
      case ste: java.net.SocketTimeoutException => println(ste); None
    }
  }
}
