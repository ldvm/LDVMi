import rest from '../../misc/rest'

export async function addDataSources(dataSources) {
  return await rest('/api/v1/datasources/add', dataSources);
}
