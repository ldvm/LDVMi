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

        return ng.module('pipeline', [
            'pipeline.services',
            'pipeline.controllers',
            'pipeline.filters',
            'pipeline.directives',
            'ngRoute',
            'ngResource',
            'ui.bootstrap',
            'ngTable',
            'angular-loading-bar',
            'angularMoment'
        ]);
    });