package model.repository

import model.entity.{CustomUnicornPlay, Output, OutputTable, OutputId}
import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class OutputRepository extends CrudRepository[OutputId, Output, OutputTable](TableQuery[OutputTable])
