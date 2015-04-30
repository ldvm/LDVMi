/**
 * bootstraps angular onto the window.document node
 */
define([
    'require',
    'angular',
    'material',
    'app',
    'appConfig'
], function (require, ng, material) {
    'use strict';

    require(['requirejs-domready!'], function (document) {
        ng.bootstrap(document, ['dataCube']);
        material.init();
    });
});