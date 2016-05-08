import rest from '../../misc/rest'

export async function getLatestPublishedApps() {
  const result = await rest('app/getLatestPublishedApps', {});
  return result.data.latestPublishedApps;
}

export async function getLatestUserApps() {
  const result = await rest('app/getLatestUserApps', {});
  return result.data.latestUserApps;
}
