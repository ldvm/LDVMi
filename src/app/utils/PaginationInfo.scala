package utils

class PaginationInfo(val skipCount: Int = 0, val pageSize: Int = PaginationInfo.DefaultPageSize)

object PaginationInfo {
  val DefaultPageSize = 10
  val FirstPageNumber = 1

  def apply(skip: Int, take: Int): PaginationInfo = {
    new PaginationInfo(skip, take)
  }

  def byPageNumber(pageNumber: Int, pageSize: Int): PaginationInfo = {
    new PaginationInfo((pageNumber - FirstPageNumber) * pageSize, pageSize)
  }
}
