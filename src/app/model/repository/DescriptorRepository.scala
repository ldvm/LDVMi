package model.repository

import model.entity._
import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class DescriptorRepository extends CrudRepository[DescriptorId, Descriptor, DescriptorTable](TableQuery[DescriptorTable])
