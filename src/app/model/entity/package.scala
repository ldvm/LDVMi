package model

import scala.slick.lifted.TableQuery

package object entity {

  val componentsQuery = TableQuery[ComponentTable]
  val componentFeaturesQuery = TableQuery[FeatureToComponentTable]
  val featuresQuery = TableQuery[FeatureTable]
  val inputsQuery = TableQuery[InputTable]

}
