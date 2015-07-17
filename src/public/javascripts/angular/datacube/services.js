define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('datacube.services', ['ngResource'])
        .factory('DataCubeService', ['$resource', function ($resource) {
            return $resource('', null, {
                getDatasets: {url: '/api/v1/datacube/datasets/:visualizationId', isArray: true},
                getDataStructures: {url: '/api/v1/datacube/datastructures/:visualizationId', isArray: true},
                getValues: {url: '/api/v1/datacube/values/:visualizationId', method: 'post'},
                queryCube: {url: '/api/v1/datacube/query-cube/:visualizationId', method: 'post'},
                slices: {url: '/api/v1/datacube/slices/:visualizationId', method: 'post'},
                getQuery: {url: '/api/v1/visualization/queries/:visualizationId', method: 'get'},
                getCached: {url: '/api/v1/visualization/cached/:visualizationId/:token', method: 'get'},
                getComponents: {url: '/api/v1/datacube/datastructure-components', method: 'get'}
            });
        }]);
});
