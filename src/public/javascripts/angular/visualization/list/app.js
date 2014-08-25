define([
        'angular',
        './controllers',
        './directives',
        './filters',
        './services',
        'ngResource',
        'ngRoute',
        'ngUi',
        'ui.bootstrap',
        'ngLoadingBar',
        'ngTable'
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
            'angular-loading-bar'
        ]);
    });