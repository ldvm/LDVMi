import rest from '../../misc/rest'

/**
 * @returns {Promise<Array<object>>}
 */
export async function getVisualizers() {
  const result = await rest('common/getVisualizers', {});
  return result.data.visualizers;
}
