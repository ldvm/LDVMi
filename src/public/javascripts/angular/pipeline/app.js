define([
        'angular',
        './controllers/compatibilityCheckController',
        './controllers/compatibilityController',
        './controllers/detailController',
        './controllers/discoveryController',
        './controllers/evaluationController',
        './controllers/indexController',
        './controllers/listController',
        './controllers/resultController',
        './controllers/layoutController',
        './directives',
        './filters',
        './services',
        'angular-resource',
        'angular-route',
        'angular-ui',
        'angular-loading-bar',
        'ng-table',
        "bootstrap",
        "angular-moment",
        'highcharts-all',
        'highcharts-ng'
    ],
    function (ng) {
        'use strict';

        return ng.module('pipeline', [
            'pipeline.controllers',
            'pipeline.filters',
            'pipeline.directives',
            'ngRoute',
            'ngResource',
            'ngTable',
            'angular-loading-bar',
            'angularMoment',
            'highcharts-ng'
        ]);
    });