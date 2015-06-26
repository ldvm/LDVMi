define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Visualization', ['VisualizationApi', function (visualizationApi) {
            return {
                skosSchemes: function (id, tolerant) {
                    return visualizationApi.skosSchemes({id: id, tolerant: !!tolerant}).$promise;
                },
                skosScheme: function (id, uri) {
                    return visualizationApi.skosScheme({id: id, schemeUri: uri}).$promise;
                },
                skosConcepts: function (id, tolerant) {
                    return visualizationApi.skosConcepts({id: id, tolerant: !!tolerant}).$promise;
                },
                createSkos: function(dataSourceTemplateId) {
                    return visualizationApi.createSkos({id: dataSourceTemplateId}).$promise;
                }
            };
        }]);

});
