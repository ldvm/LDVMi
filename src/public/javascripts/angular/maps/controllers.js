define(['angular', 'underscorejs'], function (ng, _) {
    'use strict';

    ng.module('map.controllers', []).
        controller('Map',
        ['$scope', 'MapService', '$q', '$location', '$routeParams', '$timeout',
            function ($scope, MapService, $q, $location, $routeParams, $timeout) {

                var $id = $routeParams.id;
                var $permaToken = $routeParams.p;

                if (!$id) {
                    return;
                }

                $scope.init = true;

                $scope.queryingDataset = "geolocated entities";
                MapService.polygonEntities({visualizationId: $id}, function(data){

                });

            }])
});