/**
 * bootstraps angular onto the window.document node
 */
define([
    'require',
    'angular',
    'app',
    'appConfig'
], function (require, ng) {
    'use strict';

    require(['requirejs-domready!'], function (document) {
        ng.bootstrap(document, ['pipeline']);
    });
});