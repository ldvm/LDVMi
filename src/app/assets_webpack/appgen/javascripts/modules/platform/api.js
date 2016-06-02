import rest from '../../misc/rest'

export async function getPublishedApps(paginationInfo) {
  const result = await rest('catalog/getPublishedApps', { paginationInfo });
  return result.data;
}
