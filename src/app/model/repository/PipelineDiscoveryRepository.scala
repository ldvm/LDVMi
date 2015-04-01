package model.repository

import model.entity._

import scala.slick.lifted.TableQuery
import model.entity.CustomUnicornPlay.driver.simple._

class PipelineDiscoveryRepository extends CrudRepository[PipelineDiscoveryId, PipelineDiscovery, PipelineDiscoveryTable](TableQuery[PipelineDiscoveryTable])
