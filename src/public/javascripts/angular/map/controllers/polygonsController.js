define(['angular', 'underscorejs', './controllers'], function (ng, _) {
    'use strict';

    function random() {
        return Math.floor(Math.random() * 256);
    }

    ng.module('map.controllers').
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

                $scope.queryingDataset = "SKOS concepts linked to geolocated entities";

                function getConceptUris() {
                    return $scope.properties.map(function (p) {
                        return p.schemeUri;
                    });
                }

                function getSchemaUris() {
                    return $scope.values[$scope.mainProperty.schemeUri].map(function (v) {
                        return v.uri || v.label.variants[$scope.language];
                    });
                }

                function loadCounts() {
                    mapsApi.conceptCounts({evaluationId: $id}, {propertyUri: $scope.mainProperty.uri, conceptUris: getSchemaUris()}).$promise.then(function (countsMap) {
                        $scope.counts = countsMap;
                    });
                }

                mapsApi.polygonEntitiesProperties({evaluationId: $id}).$promise.then(function (properties) {
                    $scope.properties = properties;

                    $scope.mainProperty = properties[0] || null;

                    $scope.queryingDataset = "SKOS schemes";

                    mapsApi.getSkosConcepts({evaluationId: $id}, {conceptUris: getConceptUris()}).$promise.then(function (propertiesValuesMap) {
                        $scope.queryingDataset = null;
                        $scope.values = propertiesValuesMap;
                        $scope.colors = {};

                        if ($scope.mainProperty) {
                            angular.forEach($scope.values[$scope.mainProperty.schemeUri], function (v) {
                                var key = v.uri || v.label.variants[$scope.language];
                                $scope.colors[key] = "rgba(" + random() + ", " + random() + ", " + random() + ", 0.7)";
                                v.colorStyle = {"background-color": $scope.colors[key]};
                            });
                        }

                        loadCounts();
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
                                    if (matchingObjects.length) {
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

            }]);
});