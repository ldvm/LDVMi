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
    let payload = {"urls": urls, "limit": limit};
    const result = await rest('mapsVisualizer/getCoordinates/' + id, payload);
    return result.data.coordinates;
}

export async function getPlaces(id, urls, placesTypes, limit) {
    let payload = {"urls": urls, "placeTypes": placesTypes, "limit": limit};
    const result = await rest('mapsVisualizer/getPlaces/' + id, payload);
    return result.data.places;
}

export async function getQuantifiedThings(id, urls, valueConnections, placeConnections, limit) {
    let payload = {
        "urls": urls,
        "valueConnections": valueConnections,
        "placeConnections": placeConnections,
        "limit": limit
    };
    const result = await rest('mapsVisualizer/getQuantifiedThings/' + id, payload);
    return result.data.quantifiedThings;
}

export async function getQuantifiedPlaces(id, urls, placeTypes, valueConnections, limit) {
    let payload = {"urls": urls, "placeTypes": placeTypes, "valueConnections": valueConnections, "limit": limit};
    const result = await rest('mapsVisualizer/getQuantifiedPlaces/' + id, payload);
    return result.data.quantifiers;
}

export async function getCoordinatesCount(id, urls) {
    let payload = {"urls": urls, "limit": -1};
    const result = await rest('mapsVisualizer/getCoordinates/count/' + id, payload);
    return result.data.count;
}

export async function getPlacesCount(id, urls, placesTypes) {
    let payload = {"urls": urls, "placeTypes": placesTypes, "limit": -1};
    const result = await rest('mapsVisualizer/getPlaces/count/' + id, payload);
    return result.data.count;
}

export async function getQuantifiedThingsCount(id, urls, valueConnections, placeConnections) {
    let payload = {
        "urls": urls,
        "valueConnections": valueConnections,
        "placeConnections": placeConnections,
        "limit": -1
    };
    const result = await rest('mapsVisualizer/getQuantifiedThings/count/' + id, payload);
    return result.data.count;
}

export async function getQuantifiedPlacesCount(id, urls, placeTypes, valueConnections,) {
    let payload = {"urls": urls, "placeTypes": placeTypes, "valueConnections": valueConnections, "limit": -1};
    const result = await rest('mapsVisualizer/getQuantifiedPlaces/count/' + id, payload);
    return result.data.count;
}
