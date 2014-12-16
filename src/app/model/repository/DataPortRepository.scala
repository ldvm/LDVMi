package model.repository

import model.entity._

import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class DataPortRepository extends UriIdentifiedRepository[DataPortId, DataPort, DataPortTable](TableQuery[DataPortTable])
