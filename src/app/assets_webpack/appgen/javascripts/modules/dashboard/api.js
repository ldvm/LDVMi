import rest from '../../misc/rest'

export async function getApplications(paginationInfo) {
  const result = await rest('dashboard/getApplications', { paginationInfo });
  return result.data;
}
