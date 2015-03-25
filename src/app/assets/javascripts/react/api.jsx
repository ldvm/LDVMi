import rest from 'rest';
import mime from 'rest/interceptor/mime';

// To automatically parse JSON
var client = rest.wrap(mime);

export function addDataSource(endpointUri) {
    return client({
        path: '/api/visualization/add-datasource',
        params: {
            endpointUri: endpointUri
        }
    })
}

export function addVisualization(dataDataSource, dsdDataSource, name) {
    return client({
        path: '/api/visualization/add',
        params: {
            dataDataSource: dataDataSource,
            dsdDataSource: dsdDataSource,
            name: name
        }
    })
}

export function visualization(id) {
    return client('/api/visualization/' + id);
}
