import rest from '../../../misc/rest'

export async function getProperties(id) {
  const result = await rest('mapsVisualizer/getProperties/' + id, {});
  return result.data.properties;
}
