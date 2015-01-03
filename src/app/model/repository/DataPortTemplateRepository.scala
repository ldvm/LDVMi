package model.repository

import model.entity._

import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class DataPortTemplateRepository extends UriIdentifiedRepository[DataPortTemplateId, DataPortTemplate, DataPortTemplateTable](TableQuery[DataPortTemplateTable])
