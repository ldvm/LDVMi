package model.appgen.repository
import model.appgen.entity._
import org.virtuslab.unicorn.LongUnicornPlay._
import org.virtuslab.unicorn.LongUnicornPlay.driver.simple._
import utils.PaginationInfo

class UserDataSourcesRepository extends BaseIdRepository[UserDataSourceId, UserDataSource, UserDataSources] (TableQuery[UserDataSources]) {
  // TODO: add method that fetches user repositories plus public
  // def findAvailable(user: User)

  def findByUser(user: User)(implicit session: Session): Seq[UserDataSource] = {
    query
      .filter(_.userId === user.id.get || user.isAdmin)
      .sortBy(_.name.asc)
      .list
  }

  def findByUser(user: User, paginationInfo: PaginationInfo)(implicit session: Session): Seq[UserDataSource] = {
    query
      .filter(_.userId === user.id.get || user.isAdmin)
      .sortBy(_.name.asc)
      .drop(paginationInfo.skipCount)
      .take(paginationInfo.pageSize)
      .list
  }

  def countByUser(user: User)(implicit session: Session): Int = {
    query.filter(_.userId === user.id.get || user.isAdmin).length.run
  }

  def findById(user: User, id: UserDataSourceId)(implicit session: Session): Option[UserDataSource] = {
    byIdFunc(id).filter(_.userId === user.id.get || user.isAdmin).firstOption
  }
}
