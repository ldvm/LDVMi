define([
        'angular',
        './controllers/controllers',
        './controllers/layoutController',
        './directives',
        './filters',
        './services',
        '../ldvm/filters/labelFilter',
        '../ldvm/models/visualizationModel',
        '../ldvm/directives/languageSwitch',
        '../ldvm/websocket',
        'angular-resource',
        'angular-route',
        'angular-ui',
        'ui-bootstrap',
        'angular-loading-bar',
        'highcharts-all',
        'highcharts-ng'
    ],
    function (ng) {
        'use strict';

        return ng.module('datacube', [
            'datacube.services',
            'datacube.controllers',
            'datacube.filters',
            'datacube.directives',
            'ngRoute',
            'ngResource',
            'ui.bootstrap',
            'highcharts-ng',
            'angular-loading-bar',
            'ldvm.filters',
            'ldvm.models',
            'ldvm.websocket',
            'ldvm.directives'
        ]);
    });