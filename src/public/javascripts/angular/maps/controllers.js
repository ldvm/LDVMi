define(['angular', 'underscorejs'], function (ng, _) {
    'use strict';

    ng.module('map.controllers', []).
        controller('Map',
        ['$scope', 'MapService', 'DataCubeService', '$q', '$location', '$routeParams', '$timeout',
            function ($scope, MapService, DataCubeService, $q, $location, $routeParams, $timeout) {

                var $id = $routeParams.id;
                var $permaToken = $routeParams.p;

                if (!$id) {
                    return;
                }

                $scope.init = true;

                $scope.queryingDataset = "properties of geolocated entities";
                MapService.polygonEntitiesProperties({visualizationId: $id}, function (data) {
                    $scope.properties = data;

                    var uris = data.map(function (p) {
                        return p.uri;
                    });

                    $scope.queryingDataset = "values of properties";
                    DataCubeService.getValues({ visualizationId: $id}, {uris: uris }, function (data) {
                        $scope.queryingDataset = null;
                        $scope.values = data;
                    });
                });

                $scope.refresh = function () {
                    $scope.queryingDataset = "geolocated entities";

                    var query = {filters: {}};

                    angular.forEach($scope.values, function(array, k){
                        if(k.substr(0,1) != "$"){
                            angular.forEach(array, function(v, key){
                                if(parseInt(key) > -1){
                                    var rule = v.uri || v.label;
                                    if(rule){
                                        rule.active = rule.active || false;
                                        query.enabledFilters[k] = query.enabledFilters[k] || [];
                                        query.enabledFilters[k].push(rule);
                                    }
                                }
                            });
                        }
                    });

                    MapService.polygonEntities({visualizationId: $id, query: query}, function (data) {
                        $scope.queryingDataset = null;
                        $scope.polygons = data;
                    });
                };

            }])
});