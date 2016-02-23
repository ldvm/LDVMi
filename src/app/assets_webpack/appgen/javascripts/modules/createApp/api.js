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

/**
 * @param {Array<number>} userDataSourceIds
 * @returns {Promise<number>}
 */
export async function runDiscovery(userDataSourceIds) {
  const result = await rest('createApp/runDiscovery', { userDataSourceIds });
  return result.data.userPipelineDiscoveryId;
}

/**
 * @param {number} userPipelineDiscoveryId
 * @returns {Promise<object>}
 */
export async function getDiscovery(userPipelineDiscoveryId) {
  const result = await rest('createApp/getDiscovery/' + userPipelineDiscoveryId, {});
  return result.data;
}

/**
 * @returns {Promise<Array<object>>}
 */
export async function getVisualizers() {
  const result = await rest('createApp/getVisualizers', {});
  return result.data.visualizers;
}

/**
 * @param {number} pipelineId
 * @returns {Promise<number>}
 */
export async function runEvaluation(pipelineId) {
  const result = await rest('createApp/runEvaluation/' + pipelineId, {});
  return result.message;
}

/**
 * @param {number} userPipelineDiscoveryId
 * @returns {Promise<Array<object>>}
 */
export async function getEvaluations(userPipelineDiscoveryId) {
  const result = await rest('createApp/getEvaluations/' + userPipelineDiscoveryId, {});
  return result.data.evaluations;
}
