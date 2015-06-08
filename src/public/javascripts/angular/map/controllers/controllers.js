define(['angular', 'underscorejs'], function (ng, _) {
    'use strict';

    function random() {
        return Math.floor(Math.random() * 256);
    }

    ng.module('map.controllers', []).
        controller('Polygons',
        ['$scope', 'MapService', '$q', '$location', '$routeParams',
            function ($scope, mapsApi, $q, $location, $routeParams) {

                var $id = $routeParams.id;

                if (!$id) {
                    return;
                }

                $scope.init = true;
                $scope.mainProperty = null;
                $scope.osm = true;
                $scope.language = "en";

                $scope.queryingDataset = "properties of geolocated entities";

                mapsApi.polygonEntitiesProperties({evaluationId: $id}).$promise.then(function (properties) {
                    $scope.properties = properties;

                    $scope.mainProperty = properties[0] || null;

                    var uris = properties.map(function (p) {
                        return p.schemeUri;
                    });

                    $scope.queryingDataset = "values of properties";

                    mapsApi.getSkosConcepts({evaluationId: $id}, {conceptUris: uris}).$promise.then(function (propertiesValuesMap) {
                        $scope.queryingDataset = null;
                        $scope.values = propertiesValuesMap;
                        $scope.colors = {};

                        if ($scope.mainProperty) {
                            angular.forEach($scope.values[$scope.mainProperty.schemeUri], function (v) {
                                var key = v.uri || v.label.variants[$scope.currentLanguage];
                                $scope.colors[key] = "rgba(" + random() + ", " + random() + ", " + random() + ", 0.7)";
                                v.colorStyle = {"background-color": $scope.colors[key]};
                            });
                        }
                    });
                });


                $scope.label = function (label) {
                    if (label && label.variants) {
                        if (label.variants[$scope.language]) {
                            return label.variants[$scope.language];
                        } else if (label.variants["nolang"]) {
                            return label.variants["nolang"];
                        }
                    }
                    return undefined;
                };

                $scope.refresh = function () {
                    $scope.queryingDataset = "geolocated entities";

                    var filters = {};

                    angular.forEach($scope.values, function (array, k) {
                        if (k.substr(0, 1) != "$") {
                            angular.forEach(array, function (v, key) {
                                if (parseInt(key) > -1) {

                                    var trueKey = k;
                                    var matchingObjects = _.where($scope.properties, {schemeUri: k});
                                    if(matchingObjects.length){
                                        trueKey = matchingObjects[0].uri;
                                    }

                                    filters[trueKey] = filters[trueKey] || [];
                                    filters[trueKey].push({
                                        label: v.label.variants[$scope.currentLanguage],
                                        uri: v.uri,
                                        isActive: v.isActive || false
                                    });
                                }
                            });
                        }
                    });

                    mapsApi.polygonEntities({evaluationId: $id}, {filters: filters}, function (data) {
                        $scope.queryingDataset = null;
                        $scope.entities = data;
                    });
                };

            }])
        .controller("Markers", [
            "$scope",
            "$routeParams",
            "MapService",
            "DataCubeService",
            function ($scope,
                      $routeParams,
                      MapService,
                      DataCubeService) {

                var $id = $routeParams.id;

                if (!$id) {
                    return;
                }

                $scope.language = "cs";

                $scope.label = function (label) {
                    if (label && label.variants) {
                        if (label.variants[$scope.language]) {
                            return label.variants[$scope.language];
                        } else if (label.variants["nolang"]) {
                            return label.variants["nolang"];
                        }
                    }
                    return undefined;
                };

                if(!("autoLoad" in $routeParams)) {

                    $scope.queryingDataset = "properties of geolocated entities";
                    MapService.properties({evaluationId: $id}, function (properties) {
                        $scope.properties = properties;

                        $scope.mainProperty = properties[0] || null;

                        var uris = properties.map(function (p) {
                            return p.uri;
                        });

                        $scope.queryingDataset = "values of properties";
                        DataCubeService.getValues({evaluationId: $id}, {uris: uris}, function (propertiesValuesMap) {
                            $scope.queryingDataset = null;
                            $scope.values = propertiesValuesMap;
                            $scope.colors = {};

                            angular.forEach($scope.values, function (values, k) {
                                angular.forEach(values, function (v) {
                                    v.isActive = false;
                                });
                            });

                            if ($scope.mainProperty) {
                                angular.forEach($scope.values[$scope.mainProperty.uri], function (v) {
                                    var key = v.uri || v.label.variants[$scope.currentLanguage];
                                    $scope.colors[key] = "rgba(" + random() + ", " + random() + ", " + random() + ", 0.7)";
                                    v.colorStyle = {"background-color": $scope.colors[key]};
                                });
                            }
                        });
                    });

                }



                $scope.refresh = function () {
                    $scope.queryingDataset = "geolocated entities";
                    $scope.lastError = false;

                    var filters = {};

                    angular.forEach($scope.values, function (array, k) {
                        if (k.substr(0, 1) != "$") {
                            angular.forEach(array, function (v, key) {
                                if (parseInt(key) > -1) {
                                    filters[k] = filters[k] || [];
                                    filters[k].push({
                                        label: (v.label || {variants: {}}).variants[$scope.currentLanguage],
                                        uri: v.uri,
                                        isActive: v.isActive || false
                                    });
                                }
                            });
                        }
                    });

                    MapService.markers({evaluationId: $id}, {filters: filters}, function (data) {
                        $scope.queryingDataset = null;
                        $scope.markers = data;
                        $scope.lastError = false;
                    }, function(e){
                        $scope.lastError = true;
                        $scope.queryingDataset = null;
                    });

                    $scope.center = {lat: 49, lng: 15};
                };

                if("autoLoad" in $routeParams) {
                    $scope.refresh();
                }

            }]);
});