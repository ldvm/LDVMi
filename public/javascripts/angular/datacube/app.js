define([
        'angular',
        './controllers',
        './directives',
        './filters',
        './services',
        'angular-resource'
    ],
    function (ng) {
        'use strict';

        return ng.module('dataCube', [
            'dataCube.services',
            'dataCube.controllers',
            'dataCube.filters',
            'dataCube.directives',
            'dataCube.runtimeServices',
            'ngRoute',
            'ngResource'
        ]);
    });