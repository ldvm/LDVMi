package model.appgen.repository
import model.appgen.entity._

import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._

class UserDataSourcesRepository extends BaseIdRepository[UserDataSourceId, UserDataSource, UserDataSources] (TableQuery[UserDataSources]) {
  def find(user: User)(implicit session: Session): Seq[UserDataSource] = {
    // TODO: or when the datasource is public
    query.filter(_.userId === user.id.get).run
  }
}
