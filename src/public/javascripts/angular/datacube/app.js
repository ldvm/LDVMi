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
        'highcharts',
        'ngHighcharts'
    ],
    function (ng) {
        'use strict';

        return ng.module('dataCube', [
            'dataCube.services',
            'dataCube.controllers',
            'dataCube.filters',
            'dataCube.directives',
            'ngRoute',
            'ngResource',
            'ui.bootstrap',
            'highcharts-ng',
            'angular-loading-bar'
        ]);
    });