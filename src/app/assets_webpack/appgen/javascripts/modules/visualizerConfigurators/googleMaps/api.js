import rest from '../../../misc/rest'

export async function getProperties(id) {
  const result = await rest('mapsVisualizer/getProperties/' + id, {});
  return result.data.properties;
}

export async function getSkosConcepts(id, conceptUris) {
  const result = await rest('mapsVisualizer/getSkosConcepts/' + id, { conceptUris });
  return result.data.skosConcepts;
}

export async function getSkosConceptsCounts(id, propertyUri, conceptUris) {
  const result = await rest('mapsVisualizer/getSkosConceptsCounts/' + id, { propertyUri, conceptUris });
  return result.data.skosConceptsCounts;
}
