define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('dataCube.services', ['ngResource'])
        .factory('DataCubeService', ['$resource', function ($resource) {
            return $resource('', null, {
                getDatasets: {url: '/api/datacube/datasets/:visualizationId', isArray: true},
                getDataStructures: {url: '/api/datacube/datastructures/:visualizationId', isArray: true}
            });
        }]);
});
