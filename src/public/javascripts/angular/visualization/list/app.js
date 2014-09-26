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
        'angular-loading-bar',
        'ng-table',
        "bootstrap",
        "angular-moment"
    ],
    function (ng) {
        'use strict';

        return ng.module('visualizationList', [
            'visualizationList.services',
            'visualizationList.controllers',
            'visualizationList.filters',
            'visualizationList.directives',
            'ngRoute',
            'ngResource',
            'ui.bootstrap',
            'ngTable',
            'angular-loading-bar',
            'angularMoment'
        ]);
    });