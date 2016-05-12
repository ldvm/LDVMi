import rest from '../../misc/rest'

/**
 * @returns {Promise<Array<object>>}
 */
export async function getVisualizers() {
  const result = await rest('common/getVisualizers', {});
  return result.data.visualizers;
}

export async function getLabels(appId, resourceUris) {
  const result = await rest('commonVisualizer/getLabels/' + appId, { resourceUris });
  return result.data.labels;
}
