define(['angular', 'underscore'], function (ng, _) {
    'use strict';

    ng.module('dataCube.controllers', []).
        controller('DataCube',
        ['$scope', 'DataCubeService', '$q', '$location', '$routeParams',
            function ($scope, DataCubeService, $q, $location, $routeParams) {

                var $id = $routeParams.id;

                if (!$id) {
                    return;
                }

                $scope.dataStructures = [];
                $scope.datasets = [];
                $scope.activeDSD = null;
                $scope.language = "cs";
                $scope.measuresSelectedCount = 0;

                $scope.componentTypes = [
                    {name: "Dimension", key: "dimension", plural: "Dimensions"},
                    {name: "Measure", key: "measure", plural: "Measures"},
                    {name: "Attribute", key: "attribute", plural: "Attributes"},
                ];

                $scope.setLang = function (language) {
                    $scope.language = language;
                };

                $scope.availableLanguages = ["cs", "en"];

                DataCubeService.getDatasets({ visualizationId: $id }, function () {

                });

                DataCubeService.getDataStructures({ visualizationId: $id }, function (data) {
                    $scope.dataStructures = data;
                });

                $scope.switchDSD = function (dsd) {
                    $scope.dataStructures.forEach(function (ds) {
                        ds.isActive = false;
                    });
                    dsd.isActive = true;
                    $scope.activeDSD = dsd;
                    $scope.loadComponentsValues();
                };

                $scope.loadComponentsValues = function () {

                    var uris = [];
                    $scope.activeDSD.components.forEach(function (c) {

                        function pushUri(component) {
                            if (component && component.uri) {
                                uris.push(component.uri);
                            }
                        }

                        pushUri(c.dimension);
                        pushUri(c.attribute);
                    });

                    DataCubeService.getValues({ visualizationId: $id}, {uris: uris }, function (data) {
                        $scope.values = data;
                    });
                };

                $scope.refresh = function () {
                    if ($scope.slicesSelected) {
                        DataCubeService.slices({visualizationId: $id}, {filters: collectFilters()}, function (response) {
                            $location.search({p: response.permalinkToken});
                            $scope.permalink = window.location.href;
                        });
                    } else {
                        alert("Not supported.");
                    }
                };

                $scope.toggleMeasure = function (measureComponent) {

                    measureComponent.isActive = !(measureComponent.isActive || false);

                    var count = 0;
                    if ($scope.activeDSD) {
                        var activeMeasures = _.filter($scope.activeDSD.components, function (c) {
                            return c.measure && c.isActive;
                        });
                        count = activeMeasures.length;
                    }
                    $scope.measuresSelectedCount = count;
                    computeSlicing();
                };

                $scope.toggleDimensionValue = function (value) {
                    value.isActive = !value.isActive;

                    computeSlicing();
                };

                $scope.toggleDimensionSettings = function (uri) {
                    if ($scope.settingsVisible == uri) {
                        $scope.settingsVisible = "";
                    } else {
                        $scope.settingsVisible = uri;
                    }
                };

                $scope.toggleValues = function (uri) {
                    $scope.values[uri].forEach(function (v) {
                        v.isActive = !v.isActive;
                    });

                    computeSlicing();
                };

                $scope.selectAllValues = function (uri) {
                    $scope.values[uri].forEach(function (v) {
                        v.isActive = true;
                    });

                    computeSlicing();
                };

                $scope.deselectAllValues = function (uri) {
                    $scope.values[uri].forEach(function (v) {
                        v.isActive = false;
                    });

                    computeSlicing();
                };

                function computeSlicing() {
                    var dimensions = _.filter($scope.activeDSD.components, function (c) {
                        return c.dimension;
                    });
                    dimensions.forEach(function (d) {
                        var values = $scope.values[d.dimension.uri];
                        var activeValues = _.where(values, {isActive: true});
                        $scope.dimensionValuesActiveCount = $scope.dimensionValuesActiveCount || {};
                        $scope.dimensionValuesActiveCount[d.dimension.uri] = activeValues.length;
                    });

                    var dimensionsWithMultipleCount = _.filter($scope.dimensionValuesActiveCount, function (c) {
                        return c > 1;
                    }).length;

                    $scope.slicesSelected = false;

                    if ($scope.measuresSelectedCount == 1) {
                        $scope.slicesSelected = dimensionsWithMultipleCount >= 1;
                    } else if ($scope.measuresSelectedCount > 1) {
                        $scope.slicesSelected = dimensionsWithMultipleCount == 1;
                    }

                    $scope.slicesSelected &= _.every($scope.dimensionValuesActiveCount, function (c) {
                        return c >= 1;
                    });
                }

                function collectFilters() {
                    var filters = {
                        dsdUri: $scope.activeDSD.uri,
                        components: []
                    };

                    $scope.activeDSD.components.forEach(function (c) {
                        var componentProperty = c.dimension || c.measure || c.attribute;

                        if (componentProperty && componentProperty.uri) {
                            var filter = {
                                componentUri: componentProperty.uri,
                                isActive: c.isActive || false,
                                type: c.dimension ? "dimension" : (c.measure ? "measure" : "attribute"),
                                values: ($scope.values[componentProperty.uri] || []).map(function (v) {
                                    var r = {};
                                    if (v.uri) {
                                        r.uri = v.uri;
                                    } else {
                                        r.label = v.label;
                                    }
                                    r.isActive = v.isActive;
                                    return r;
                                })
                            };
                            filters.components.push(filter);
                        } else {
                            throw "The component property has no URI. This is not supported";
                        }

                    });

                    return filters;
                }
            }])
    ;
});