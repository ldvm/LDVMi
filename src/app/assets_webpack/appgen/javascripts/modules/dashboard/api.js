import rest from '../../misc/rest'

export async function getApplications(paginationInfo) {
  const result = await rest('dashboard/getApplications', { paginationInfo });
  return result.data;
}

export async function getDiscoveries(paginationInfo) {
  const result = await rest('dashboard/getDiscoveries', { paginationInfo });
  return result.data;
}

export async function deleteDiscovery(id) {
  return await rest('dashboard/deleteDiscovery/' + id, {});
}
