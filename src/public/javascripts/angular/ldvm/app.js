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
        './controllers/treemapController',
        './controllers/layoutController',
        './directives/dynamicChart',
        './directives/forceLayout',
        './directives/sparkLine',
        './directives/treemap',
        './websocket',
        './utils',
        './filters/labelFilter',
        './models/componentModel',
        './models/evaluationModel',
        './models/visualizationModel',
        './models/pipelineModel',
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

        return ng.module('ldvm', [
            'ldvm.controllers',
            'ldvm.directives',
            'ldvm.filters',
            'ngRoute',
            'ngResource',
            'ngTable',
            'angular-loading-bar',
            'angularMoment',
            'highcharts-ng'
        ]);
    });