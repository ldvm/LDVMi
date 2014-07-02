define(['angular'], function (ng) {
    'use strict';

    ng.module('dataCube.filters', []).
        filter('interpolate', ['version', function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }]);
});
