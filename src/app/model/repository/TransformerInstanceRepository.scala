package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class TransformerInstanceRepository extends CrudRepository[TransformerInstanceId, TransformerInstance, TransformerInstanceTable](TableQuery[TransformerInstanceTable])
