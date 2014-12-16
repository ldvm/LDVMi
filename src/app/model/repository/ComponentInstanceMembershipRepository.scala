package model.repository

import model.entity.CustomUnicornPlay.driver.simple._
import model.entity._

import scala.slick.lifted.TableQuery

class ComponentInstanceMembershipRepository extends CrudRepository[ComponentInstanceMembershipId, ComponentInstanceMembership, ComponentInstanceMembershipTable](TableQuery[ComponentInstanceMembershipTable])
