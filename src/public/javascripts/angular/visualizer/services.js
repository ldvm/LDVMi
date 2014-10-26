define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('visualizer.services', ['ngResource'])
        .factory('VisualizerService', ['$resource', function ($resource) {
            return $resource('/api/visualizer', null, {
                query: {url: '/api/visualizer/list', isArray: false},
                save: {url: '/api/visualizer/add', method: 'GET', isArray: false}
            });
        }]);
});
