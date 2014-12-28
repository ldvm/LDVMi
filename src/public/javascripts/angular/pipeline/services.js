define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('payola.api', ['ngResource'])
        .factory('PipelineApi', ['$resource', function ($resource) {
            return $resource('/api/v1/pipelines', null, {
                query: {url: '/api/v1/pipelines', isArray: false},
                get: {url: '/api/v1/pipelines/:id', isArray: false},
                add: {url: '/api/v1/pipelines/ttl', isArray: false},
                visualization: {url: '/api/v1/pipelines/visualization/:id', isArray: false}
            });
        }])
        .factory('DatasourceApi', ['$resource', function ($resource) {
            return $resource('/api/v1/visualization', null, {
                add: {url: '/api/v1/visualization/add-datasource', isArray: false}
            });
        }])
        .factory('CompatibilityApi', ['$resource', function ($resource) {
            return $resource(null, null, {
                get: {url: '/api/v1/compatibility/:id', isArray: true},
                check: {url: '/api/v1/compatibility/check/:id', isArray: true}
            });
        }]);

    ng.module('payola.utils', [])
        .service('PaginationUtils', [function () {
            return {
                buildQuery: function (page, pageSize) {
                    return {
                        skip: ((page - 1) * pageSize),
                        take: pageSize
                    };
                }
            };
        }]);

    ng.module('pipeline.model', ['payola.api', 'payola.utils'])
        .service('Pipelines', [
            'PipelineApi',
            'PaginationUtils',
            function (pipelineApi,
                      paginationUtils) {
                return {
                    findPaginated: function (page, pageSize) {
                        var query = paginationUtils.buildQuery(page, pageSize);
                        return pipelineApi.query(query).$promise;
                    },
                    visualization: function (id) {
                        return pipelineApi.visualization({id: id}).$promise;
                    }
                };
            }
        ]);
});
