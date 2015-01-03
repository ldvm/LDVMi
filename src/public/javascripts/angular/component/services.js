define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('component.services', ['ngResource'])
        .factory('ComponentsService', ['$resource', function ($resource) {
            return $resource('/api/v1/visualizer', null, {
                query: {url: '/api/v1/visualizer/list', isArray: false},
                save: {url: '/api/v1/visualizer/add', method: 'GET', isArray: false}
            });
        }]);
});
