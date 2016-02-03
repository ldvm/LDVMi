import rest from '../../misc/rest'

/**
 * @returns {Promise<Array<number>>} list of data source template ids
 **/
export async function addDataSources(dataSources) {
  const result = await rest('/api/v1/datasources/add', dataSources);
  return Object.keys(result).map(key => result[key].id);
}

/**
 * Opens a discovery socket with the backend.
 * @param {Array<number>} dataSourceTemplateIds
 * @returns {WebSocket}
 */
export function openDiscoverySocket(dataSourceTemplateIds) {
  const socketUrl = 'ws://' + window.location.host + '/api/v1/pipelines/discover?'
    + dataSourceTemplateIds.map(id => 'dataSourceTemplateIds=' + id).join('&');

  return new WebSocket(socketUrl);
}

/**
 * @returns {Promise<Array<{id: number, bindingSetId: number, title: string, uuid: string}>>}
 */
export async function getPipelines(discoveryId) {
  const result = await rest('/api/v1/pipelines?discoveryId=' + discoveryId + '&skip=0&take=50', null, 'GET');
  return result.data;
}
