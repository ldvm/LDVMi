import { List } from 'immutable'
import { Pipeline, Evaluation } from './models'
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
 * Opens an evaluation socket with the backend.
 * @param {Array<number>} pipelineId
 * @returns {WebSocket}
 */
export function openEvaluationSocket(pipelineId) {
  const socketUrl = 'ws://' + window.location.host + '/api/v1/pipelines/evaluate/' + pipelineId
  return new WebSocket(socketUrl);
}

/**
 * Get list of pipelines by discovery id.
 * @returns {Promise<List<Pipeline>>}
 */
export async function getPipelines(discoveryId) {
  const result = await rest('/api/v1/pipelines?discoveryId=' + discoveryId + '&skip=0&take=50', null, 'GET');
  return new List(result.data.map(pipeline => Pipeline(pipeline)));
}

/**
 * Get pipeline by its id.
 * @returns {Promise<Pipeline>}
 */
export async function getPipeline(id) {
  return new Pipeline(await rest('/api/v1/pipelines/' + id, null, 'GET'));
}

/**
 * Get pipeline evaluations.
 * @returns {Promise<Array<{id: number, isFinished: boolean, isSuccess: boolean, pipelineId: 89}>>}
 */
export async function getPipelineEvaluations(id) {
  const result =  await rest('/api/v1/pipelines/evaluations/' + id, null, 'GET');
  return new List(result.data.map(evaluation => Evaluation(evaluation)));
}
