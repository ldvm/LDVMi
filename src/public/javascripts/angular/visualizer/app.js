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

        return ng.module('visualizer', [
            'visualizer.services',
            'visualizer.controllers',
            'visualizer.filters',
            'visualizer.directives',
            'ngRoute',
            'ngResource',
            'ui.bootstrap',
            'ngTable',
            'angular-loading-bar',
            'angularMoment'
        ]);
    });