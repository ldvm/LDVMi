define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('component.services', ['ngResource'])
        .factory('ComponentsService', ['$resource', function ($resource) {
            return $resource('/api/visualizer', null, {
                query: {url: '/api/visualizer/list', isArray: false},
                save: {url: '/api/visualizer/add', method: 'GET', isArray: false}
            });
        }]);
});
