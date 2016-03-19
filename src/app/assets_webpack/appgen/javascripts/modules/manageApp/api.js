import rest from '../../misc/rest'

/**  @returns {Promise<object>} application */
export async function getApplication(id) {
  const result = await rest('manageApp/getApp/' + id, {});
  return result.data.application;
}

/**  @returns {Promise<{status, message, data}>} */
export async function saveConfiguration(id, configuration) {
  return await rest('manageApp/saveAppConfiguration/' + id, {
    configuration: JSON.stringify(configuration)
  });
}

/**  @returns {Promise<object>} */
export async function getConfiguration(id) {
  const result = await rest('manageApp/getAppConfiguration/' + id, {});
  return JSON.parse(result.data.configuration) || {};
}
