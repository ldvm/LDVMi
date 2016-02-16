import { List } from 'immutable'
import rest from '../../misc/rest'

/**
 * @returns {Promise<object>} inserted data source including its id
 **/
export async function addDataSource(dataSource) {
  const result = await rest('createApp/addDataSource', dataSource);
  return result.data.dataSource;
}

export async function getDataSources() {
  return await rest('createApp/getDataSources');
}
