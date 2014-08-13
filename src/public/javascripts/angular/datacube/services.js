define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('dataCube.services', ['ngResource'])
        .factory('DataCubeService', ['$resource', function ($resource) {
            return $resource('', null, {
                getDatasets: {url: '/api/datacube/datasets/:visualizationId', isArray: true},
                getDataStructures: {url: '/api/datacube/datastructures/:visualizationId', isArray: true},
                getValues: {url: '/api/datacube/values/:visualizationId', method: 'post'},
                queryCube: {url: '/api/datacube/query-cube/:visualizationId', method: 'post'},
                slices: {url: '/api/datacube/slices/:visualizationId', method: 'post'},
                getQuery: {url: '/api/visualization/queries/:visualizationId', method: 'get'},
                getCached: {url: '/api/visualization/cached/:visualizationId/:token', method: 'get'}
            });
        }]);
});
