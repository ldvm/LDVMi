define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('map.services', ['ngResource'])
        .factory('MapService', ['$resource', function ($resource) {
            return $resource('', null, {
                polygonEntities: {url: '/api/v1/map/polygon-entities/:evaluationId', method: 'POST', isArray: true},
                polygonEntitiesProperties: {url: '/api/v1/map/polygon-entities-properties/:evaluationId', isArray: true},
                getSkosConcepts: {url: '/api/v1/skos/concepts/:evaluationId', method: 'POST'},
                conceptCounts: {url: '/api/v1/skos/concepts/counts/:evaluationId', method: 'POST'},
                properties: {url: '/api/v1/map/properties/:evaluationId', isArray: true},
                markers: {url: '/api/v1/map/markers/:evaluationId', isArray: true, method: 'POST'}
            });
        }])
        .factory('DataCubeService', ['$resource', function ($resource) {
            return $resource('', null, {
                getValues: {url: '/api/v1/datacube/values/:evaluationId', method: 'post'}
            });
        }]);

});
