package model.repository

import model.entity._
import CustomUnicornPlay.driver.simple._

import scala.slick.lifted.TableQuery

class TransformerRepository extends CrudRepository[TransformerId, Transformer, TransformerTable](TableQuery[TransformerTable])
