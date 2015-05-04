define([
        'angular',
        "codemirror-sparql",
        './controllers/controllers',
        './controllers/layoutController',
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
        "angular-file-upload",
        "ui-codemirror"
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
            'ui.codemirror',
            'ngTable',
            'angular-loading-bar',
            'angularMoment',
            "angularFileUpload"
        ]);
    });