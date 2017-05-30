import rest from "../../../misc/rest";

export async function getProperties(id) {
    const result = await rest('mapsVisualizer/getProperties/' + id, {});
    return result.data.properties;
}

export async function getSkosConcepts(id, conceptUris) {
    const result = await rest('mapsVisualizer/getSkosConcepts/' + id, {conceptUris});
    return result.data.skosConcepts;
}

export async function getSkosConceptsCounts(id, propertyUri, conceptUris) {
    const result = await rest('mapsVisualizer/getSkosConceptsCounts/' + id, {propertyUri, conceptUris});
    return result.data.skosConceptsCounts;
}

export async function getMarkers(id, mapQueryData) {
    const result = await rest('mapsVisualizer/getMarkers/' + id, mapQueryData);
    return result.data.markers;
}

export async function getCoordinates(id, urls, limit) {
    const result = await rest('mapsVisualizer/getCoordinates/' + id, {urls, limit});
    return result.data.coordinates;
}

export async function getPlaces(id, placesUrls, placesTypes, limit) {
    let payload = {"things": placesUrls, "thingTypes": placesTypes, "connections": [], "limit": limit};
    const result = await rest('mapsVisualizer/getPlaces/' + id, payload);
    return result.data.places;
}

export async function getThingsWithPlaces(id, thingsUrls, thingsTypes, connections, limit) {
    let payload = {"things": thingsUrls, "thingTypes": thingsTypes, "connections": connections, "limit": limit};
    const result = await rest('mapsVisualizer/getThingsWithPlaces/' + id, payload);
    return result.data.thingsWithPlaces;
}

export async function getQuantifiers(id, urls, connections, limit) {
    let payload = {"things": urls, "thingTypes": [], "connections": connections, "limit": limit};
    const result = await rest('mapsVisualizer/getQuantifiers/' + id, payload);
    return result.data.quantifiers;
}

export async function getCoordinatesCount(id, urls) {
    const result = await rest('mapsVisualizer/getCoordinates/count/' + id, {urls, "limit": -1});
    return result.data.count;
}

export async function getPlacesCount(id, placesUrls, placesTypes) {
    let payload = {"things": placesUrls, "thingTypes": placesTypes, "connections": [], "limit": -1};
    const result = await rest('mapsVisualizer/getPlaces/counts/' + id, payload);
    return result.data.count;
}

export async function getThingsWithPlacesCount(id, thingsUrls, thingsTypes, connections) {
    let payload = {"things": thingsUrls, "thingTypes": thingsTypes, "connections": connections, "limit": -1};
    const result = await rest('mapsVisualizer/getThingsWithPlaces/count/' + id, payload);
    return result.data.count;
}

export async function getQuantifiersCount(id, urls, connections) {
    let payload = {"things": urls, "thingTypes": [], "connections": connections, "limit": -1};
    const result = await rest('mapsVisualizer/getQuantifiers/count/' + id, payload);
    return result.data.count;
}
