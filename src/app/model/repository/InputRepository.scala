package model.repository

import model.entity._

import scala.slick.lifted.TableQuery
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class InputRepository extends CrudRepository[InputId, Input, InputTable](TableQuery[InputTable])
