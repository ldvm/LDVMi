package model.repository

import model.entity.{CustomUnicornPlay, ComponentTemplate, ComponentTemplateId, ComponentTemplateTable}

import scala.slick.lifted.TableQuery
import CustomUnicornPlay.driver.simple._

class ComponentTemplateRepository extends UriIdentifiedRepository[ComponentTemplateId, ComponentTemplate, ComponentTemplateTable](TableQuery[ComponentTemplateTable])
