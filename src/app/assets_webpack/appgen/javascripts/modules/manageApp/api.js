import rest from '../../misc/rest'

/**  @returns {Promise<object>} application */
export async function getApplication(id) {
  const result = await rest('manageApp/getApp/' + id, {});
  return result.data.application;
}
