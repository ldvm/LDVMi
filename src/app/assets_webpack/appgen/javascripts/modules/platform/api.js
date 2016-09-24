import rest from '../../misc/rest'

export async function getPublishedApps(paginationInfo) {
  const result = await rest('catalog/getPublishedApps', { paginationInfo });
  return result.data;
}

export async function install() {
  const result = await rest('install', { });
  return result.data.results;
}
