import rest from '../../../misc/rest'
import { applyByBatchesCount, applyByBatchesWithLimit } from '../../common/utils/apiUtils'

const BATCH_SIZE = 100;

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

export async function getMarkers(id, mapQueryData) {
  const result = await rest('mapsVisualizer/getMarkers/' + id, mapQueryData);
  return result.data.markers;
}

export async function getCoordinates(id, urls, limit) {
  const batchFunc = async function (batchUrls, batchLimit) {
    let payload = {
      'urls': batchUrls,
      'limit': batchLimit
    };
    const result = await rest('mapsVisualizer/getCoordinates/' + id, payload);
    return result.data.coordinates;
  };
  return applyByBatchesWithLimit(urls, BATCH_SIZE, limit, batchFunc);
}

export async function getPlaces(id, urls, placesTypes, limit) {
  const batchFunc = async function (batchUrls, batchLimit) {
    let payload = {
      'urls': batchUrls,
      'placeTypes': placesTypes,
      'limit': batchLimit
    };
    const result = await rest('mapsVisualizer/getPlaces/' + id, payload);
    return result.data.places;
  };
  return applyByBatchesWithLimit(urls, BATCH_SIZE, limit, batchFunc);
}

export async function getQuantifiedThings(id, urls, valuePredicates, placePredicates, limit) {
  const batchFunc = async function (batchUrls, batchLimit) {
    let payload = {
      'urls': batchUrls,
      'valuePredicates': valuePredicates,
      'placePredicates': placePredicates,
      'limit': batchLimit
    };
    const result = await rest('mapsVisualizer/getQuantifiedThings/' + id, payload);
    return result.data.quantifiedThings;
  };
  return applyByBatchesWithLimit(urls, BATCH_SIZE, limit, batchFunc);
}

export async function getQuantifiedPlaces(id, urls, placeTypes, valuePredicates, limit) {
  const batchFunc = async function (batchUrls, batchLimit) {
    let payload = {
      'urls': batchUrls,
      'placeTypes': placeTypes,
      'valuePredicates': valuePredicates,
      'limit': batchLimit
    };
    const result = await rest('mapsVisualizer/getQuantifiedPlaces/' + id, payload);
    return result.data.quantifiedPlaces;
  };
  return applyByBatchesWithLimit(urls, BATCH_SIZE, limit, batchFunc);
}

export async function getCoordinatesCount(id, urls) {
  const batchFunc = async function (batchUrls) {

    let payload = {
      'urls': batchUrls,
      'limit': -1
    };
    const result = await rest('mapsVisualizer/getCoordinates/count/' + id, payload);
    return result.data.count;
  };
  return applyByBatchesCount(urls, BATCH_SIZE, batchFunc);
}

export async function getPlacesCount(id, urls, placesTypes) {
  const batchFunc = async function (batchUrls) {
    let payload = {
      'urls': batchUrls,
      'placeTypes': placesTypes,
      'limit': -1
    };
    const result = await rest('mapsVisualizer/getPlaces/count/' + id, payload);
    return result.data.count;
  };
  return applyByBatchesCount(urls, BATCH_SIZE, batchFunc);
}

export async function getQuantifiedThingsCount(id, urls, valuePredicates, placePredicates) {
  const batchFunc = async function (batchUrls) {
    let payload = {
      'urls': batchUrls,
      'valuePredicates': valuePredicates,
      'placePredicates': placePredicates,
      'limit': -1
    };
    const result = await rest('mapsVisualizer/getQuantifiedThings/count/' + id, payload);
    return result.data.count;
  };
  return applyByBatchesCount(urls, BATCH_SIZE, batchFunc);
}

export async function getQuantifiedPlacesCount(id, urls, placeTypes, valuePredicates) {
  const batchFunc = async function (batchUrls) {
    let payload = {
      'urls': batchUrls,
      'placeTypes': placeTypes,
      'valuePredicates': valuePredicates,
      'limit': -1
    };
    const result = await rest('mapsVisualizer/getQuantifiedPlaces/count/' + id, payload);
    return result.data.count;
  };
  return applyByBatchesCount(urls, BATCH_SIZE, batchFunc);
}
