define(['angular', 'underscorejs', './controllers'], function (ng, _) {
    'use strict';

    function random() {
        return Math.floor(Math.random() * 256);
    }

    ng.module('map.controllers')
        .controller("Markers", [
            "$scope",
            "$routeParams",
            "MapService",
            function ($scope,
                      $routeParams,
                      mapsApi
            ) {

                var $id = $routeParams.id;

                if (!$id) {
                    return;
                }

                $scope.language = "cs";
                $scope.clustering = true;

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

                function getConceptUris() {
                    return $scope.properties.map(function (p) {
                        return p.schemeUri;
                    });
                }

                function getSchemaUris(schemeUri) {
                    return $scope.values[schemeUri].map(function (v) {
                        return v.uri || v.label.variants[$scope.language];
                    });
                }

                function loadCounts(uri, schemeUri) {
                    mapsApi.conceptCounts({evaluationId: $id}, {propertyUri: uri, conceptUris: getSchemaUris(schemeUri)}).$promise.then(function (countsMap) {
                        $scope.counts = _.extend($scope.counts, countsMap);
                    });
                }

                if (!("autoLoad" in $routeParams)) {

                    $scope.queryingDataset = "properties of geolocated entities";

                    mapsApi.properties({evaluationId: $id}, function (properties) {
                        $scope.properties = properties;

                        $scope.mainProperty = properties[0] || null;

                        $scope.queryingDataset = "SKOS schemes";

                        mapsApi.getSkosConcepts({evaluationId: $id}, {conceptUris: getConceptUris()}).$promise.then(function (propertiesValuesMap) {
                            $scope.queryingDataset = null;
                            $scope.values = propertiesValuesMap;
                            $scope.colors = {};

                            if ($scope.mainProperty) {
                                ng.forEach($scope.values[$scope.mainProperty.schemeUri], function (v) {
                                    var key = v.uri || v.label.variants[$scope.language];
                                    $scope.colors[key] = "rgba(" + random() + ", " + random() + ", " + random() + ", 0.7)";
                                    v.colorStyle = {"background-color": $scope.colors[key]};
                                });
                            }

                            $scope.counts = {};
                            ng.forEach($scope.properties, function(p){
                                loadCounts(p.uri, p.schemeUri);
                            });
                        });
                    });

                }

                if ('clustering' in $routeParams) {
                    $scope.clustering = parseInt($routeParams.clustering.toLocaleLowerCase()) === 1;
                }


                $scope.refresh = function () {
                    $scope.queryingDataset = "geolocated entities";
                    $scope.lastError = false;

                    var filters = {};

                    ng.forEach($scope.values, function (array, k) {
                        if (k.substr(0, 1) != "$") {
                            ng.forEach(array, function (v, key) {
                                if (parseInt(key) > -1) {

                                    var trueKey = k;
                                    var matchingObjects = _.where($scope.properties, {schemeUri: k});
                                    if (matchingObjects.length) {
                                        trueKey = matchingObjects[0].uri;
                                    }

                                    filters[trueKey] = filters[trueKey] || [];
                                    filters[trueKey].push({
                                        label: (v.label || {variants: {}}).variants[$scope.currentLanguage],
                                        uri: v.uri,
                                        isActive: v.isActive || false
                                    });
                                }
                            });
                        }
                    });

                    mapsApi.markers({evaluationId: $id}, {filters: filters}, function (data) {
                        $scope.queryingDataset = null;
                        $scope.markers = data;
                        $scope.lastError = false;
                    }, function (e) {
                        $scope.lastError = true;
                        $scope.queryingDataset = null;
                    });

                    $scope.center = {lat: 49, lng: 15};
                };

                if ("autoLoad" in $routeParams) {
                    $scope.refresh();
                }

            }]);
});