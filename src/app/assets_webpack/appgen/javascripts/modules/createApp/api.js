import { List } from 'immutable'
import rest from '../../misc/rest'

/**
 * // TODO: return the whole data source
 * @returns {Promise<number>} user data source id
 **/
export async function addDataSources(dataSource) {
  const result = await rest('createApp/addDataSource', dataSource);
  return result;
}
