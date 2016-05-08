import rest from '../../misc/rest'

export async function getLatestPublishedApps() {
  const result = await rest('app/getLatestPublishedApps', {});
  return result.data.latestPublishedApps;
}
