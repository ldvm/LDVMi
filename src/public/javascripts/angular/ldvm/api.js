define(['angular'], function (ng) {
    'use strict';

    ng.module('ldvm.api', ['ngResource'])
        .factory('PipelineApi', ['$resource', function ($resource) {
            return $resource('/api/v1/pipelines', null, {
                query: {url: '/api/v1/pipelines', isArray: false},
                get: {url: '/api/v1/pipelines/:id', isArray: false},
                add: {url: '/api/v1/pipelines/ttl', isArray: false},
                visualization: {url: '/api/v1/pipelines/visualization/:id', isArray: true},
                evaluations: {url: '/api/v1/pipelines/evaluations/:id', isArray: false},
                discover: {url: '/api/v1/pipelines/discover', isArray: false}
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
        }])
        .factory('ComponentsApi', ['$resource', function ($resource) {
            return $resource(null, null, {
                createDatasource: {url: '/api/v1/datasources/add', method: 'POST', isArray: false}
            });
        }])
        .factory('EvaluationApi', ['$resource', function ($resource) {
            return $resource(null, null, {
                result: {url: '/api/v1/evaluation/result/:id', method: 'GET', isArray: true}
            });
        }])
        .factory('VisualizationApi', ['$resource', function ($resource) {
            return $resource(null, null, {
                skosSchemes: {url: '/api/v1/skos/schemes/:id', method: 'GET', isArray: true},
                skosScheme: {url: '/api/v1/skos/scheme/:id', method: 'GET', isArray: false}
            });
        }]);
});
