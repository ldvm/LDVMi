define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('map.services', ['ngResource'])
        .factory('MapService', ['$resource', function ($resource) {
            return $resource('', null, {
                polygonEntities: {url: '/api/map/polygon-entities/:visualizationId', isArray: true}
            });
        }]);
});
