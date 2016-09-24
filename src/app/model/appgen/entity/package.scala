package model.appgen

import scala.slick.lifted.TableQuery

package object entity {
  val userPipelineDiscoveriesQuery = TableQuery[UserPipelineDiscoveries]
}
