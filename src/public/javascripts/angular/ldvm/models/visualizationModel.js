define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Visualization', ['VisualizationApi', function (visualizationApi) {
            return {
                skosSchemes: function (id) {
                    return visualizationApi.skosSchemes({id: id}).$promise;
                },
                skosScheme: function (id, uri) {
                    return visualizationApi.skosScheme({id: id, schemeUri: uri}).$promise;
                }
            };
        }]);

});
