define(['angular'], function (ng) {
    'use strict';

    ng.module('ldvm.api', ['ngResource'])
        .factory('PipelineApi', ['$resource', function ($resource) {
            return $resource('/api/v1/pipelines', null, {
                query: {url: '/api/v1/pipelines', isArray: false},
                get: {url: '/api/v1/pipelines/:id', isArray: false},
                add: {url: '/api/v1/pipelines/ttl', isArray: false},
                visualization: {url: '/api/v1/pipelines/visualization/:id', isArray: false},
                evaluations: {url: '/api/v1/pipelines/evaluations/:id', isArray: false},
                discover: {url: '/api/v1/pipelines/discover', isArray: false},
                makePermanent: {url: '/api/v1/pipelines/makePermanent/:id', isArray: false}
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
                createSparqlEndpoints: {url: '/api/v1/dataSources/createSparqlEndpoints', method: 'POST', isArray: true},
                makePermanent: {url: '/api/v1/component/makePermanent/:id', method: 'GET', isArray: false}
            });
        }])
        .factory('EvaluationApi', ['$resource', function ($resource) {
            return $resource(null, null, {
                result: {url: '/api/v1/evaluation/result/:id', method: 'GET', isArray: true},
                get: {url: '/api/v1/evaluation/:id', method: 'GET', isArray: false}
            });
        }])
        .factory('SkosApi', ['$resource', function ($resource) {
            return $resource(null, null, {
                schemes: {url: '/api/v1/skos/schemes/:id', method: 'GET', isArray: true},
                scheme: {url: '/api/v1/skos/scheme/:id', method: 'GET', isArray: false},
                concepts: {url: '/api/v1/skos/concepts/:id', method: 'GET', isArray: true},
                create: {url: '/api/v1/skos/create/:id', method: 'GET', isArray: false}
            });
        }])
        .factory('DataCubeApi', ['$resource', function ($resource) {
            return $resource(null, null, {
                create: {url: '/api/v1/datacube/create/:id', method: 'GET', isArray: false},
                dataStructures: {url: '/api/v1/datacube/datastructures/:id', method: 'GET', isArray: true},
                dataStructureComponents: {
                    url: '/api/v1/datacube/datastructure-components',
                    method: 'GET',
                    isArray: false
                }
            });
        }]);
});
