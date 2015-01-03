package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class TransformerTemplateRepository extends CrudRepository[TransformerTemplateId, TransformerTemplate, TransformerTemplateTable](TableQuery[TransformerTemplateTable])
