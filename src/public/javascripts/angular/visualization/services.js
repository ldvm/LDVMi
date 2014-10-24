define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('visualizationList.services', ['ngResource'])
        .factory('VisualizationService', ['$resource', function ($resource) {
            return $resource('/api/visualization', null, {
                query: {url: '/api/visualization/list', isArray: false},
                add: {url: '/api/visualization/add', isArray: false}
            });
        }])
        .factory('DatasourceService', ['$resource', function ($resource) {
            return $resource('/api/visualization', null, {
                add: {url: '/api/visualization/add-datasource', isArray: false}
            });
        }]);
});
