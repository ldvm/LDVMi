package model.appgen.repository
import model.appgen.entity._

import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class UserDataSourcesRepository extends BaseIdRepository[UserDataSourceId, UserDataSource, UserDataSources] (TableQuery[UserDataSources])


