define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('component.services', ['ngResource'])
        .factory('ComponentsService', ['$resource', function ($resource) {
            return $resource('/api/v1/component/:id', null, {
                query: {url: '/api/v1/component/list', isArray: false},
                save: {url: '/api/v1/component/add', method: 'GET', isArray: false},

                features: {url: '/api/v1/component/:id/features', method: 'GET', isArray: true},
                inputs: {url: '/api/v1/component/:id/inputs', method: 'GET', isArray: true},
                output: {url: '/api/v1/component/:id/output', method: 'GET', isArray: false},
                descriptors: {url: '/api/v1/component/:id/descriptors', method: 'GET', isArray: true},
                makePermanent: {url: '/api/v1/component/makePermanent/:id', method: 'GET', isArray: false}
            });
        }]);
});
