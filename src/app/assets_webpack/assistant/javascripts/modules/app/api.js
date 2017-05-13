import rest from '../../misc/rest'

export async function getApplication(id) {
  const result = await rest('app/getApp/' + id, {});
  return result.data.application;
}

export async function updateSettings(id, values) {
  return await rest('manageApp/updateAppSettings/' + id, values);
}

export async function saveConfiguration(id, configuration) {
  return await rest('manageApp/saveAppConfiguration/' + id, {
    configuration: JSON.stringify(configuration)
  });
}

export async function publishApp(id, published) {
  return await rest('manageApp/publishApp/' + id, { published });
}

export async function deleteApp(id) {
  return await rest('manageApp/deleteApp/' + id, {});
}

export async function getConfiguration(id) {
  const result = await rest('app/getAppConfiguration/' + id, {});
  return JSON.parse(result.data.configuration) || {};
}

export async function getLabels(appId, resourceUris) {
  const result = await rest('commonVisualizer/getLabels/' + appId, { resourceUris });
  return result.data.labels;
}

export async function getComments(appId, resourceUris) {
  const result = await rest('commonVisualizer/getComments/' + appId, { resourceUris });
  return result.data.comments;
}
