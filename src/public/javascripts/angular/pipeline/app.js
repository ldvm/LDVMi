define([
        'angular',
        './controllers',
        './directives',
        './filters',
        './services',
        'angular-resource',
        'angular-route',
        'angular-ui',
        'ui-bootstrap',
        'ui-bootstrap-tpls',
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
            'ui.bootstrap',
            'ngTable',
            'angular-loading-bar',
            'angularMoment',
            'highcharts-ng'
        ]);
    });