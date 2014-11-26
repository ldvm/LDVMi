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
        "angular-moment",
        "angular-file-upload"
    ],
    function (ng) {
        'use strict';

        return ng.module('component', [
            'component.services',
            'component.controllers',
            'component.filters',
            'component.directives',
            'ngRoute',
            'ngResource',
            'ui.bootstrap',
            'ngTable',
            'angular-loading-bar',
            'angularMoment',
            "angularFileUpload"
        ]);
    });