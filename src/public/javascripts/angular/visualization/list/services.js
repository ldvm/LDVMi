define(['angular'], function (ng) {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    ng.module('visualizationList.services', ['ngResource'])
        .factory('VisualizationService', ['$resource', function ($resource) {
            return $resource('', null, {
                /*getDatasets: {url: '/api/datacube/datasets/:visualizationId', isArray: true} */
            });
        }]);
});
