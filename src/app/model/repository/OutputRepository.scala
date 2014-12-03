package model.repository

import model.entity.{Output, OutputTable, OutputId}
import scala.slick.lifted.TableQuery
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class OutputRepository extends CrudRepository[OutputId, Output, OutputTable](TableQuery[OutputTable])
