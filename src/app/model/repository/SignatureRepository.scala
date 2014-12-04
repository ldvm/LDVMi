package model.repository

import model.entity._
import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class SignatureRepository extends CrudRepository[SignatureId, Signature, SignatureTable](TableQuery[SignatureTable])
