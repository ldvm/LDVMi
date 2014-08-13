define(['angular', 'underscore'], function (ng, _) {
    'use strict';

    ng.module('dataCube.controllers', []).
        controller('DataCube',
        ['$scope', 'DataCubeService', '$q', '$location', '$routeParams',
            function ($scope, DataCubeService, $q, $location, $routeParams) {

                var $id = $routeParams.id;
                var $permaToken = $routeParams.p;
                var $view = $routeParams.view;
                var $chartType = $routeParams.chartType;
                var $isPolar = $routeParams.isPolar === true;

                if (!$id) {
                    return;
                }

                $scope.dataStructures = [];
                $scope.datasets = [];
                $scope.activeDSD = null;
                $scope.language = "cs";
                $scope.measuresSelectedCount = 0;
                $scope.chartVisible = true;
                $scope.init = true;

                $scope.componentTypes = [
                    {name: "Dimension", key: "dimension", plural: "Dimensions"},
                    {name: "Measure", key: "measure", plural: "Measures"},
                    {name: "Attribute", key: "attribute", plural: "Attributes"},
                ];

                $scope.highcharts = {
                    options: {
                        chart: {
                            type: 'line',
                            height: 650
                        }
                    },
                    series: [
                    ],
                    title: {
                        text: 'DataCube'
                    },
                    yAxis: {
                        title: {
                            text: ""
                        }/*,
                         currentMin: 0,
                         currentMax: 100*/
                    },
                    loading: false
                };

                $scope.labelsRegistry = {};

                $scope.showMap = function () {
                    $scope.euMapVisible = false;
                    $scope.mapVisible = true;
                    $scope.chartVisible = false;
                };
                $scope.showEuMap = function () {
                    $scope.euMapVisible = true;
                    $scope.chartVisible = false;
                    $scope.mapVisible = false;
                };
                $scope.showChart = function () {
                    $scope.euMapVisible = false;
                    $scope.mapVisible = false;
                    $scope.chartVisible = true;
                };

                $scope.switchChart = function (chartType, setUrl) {
                    $scope.highcharts.options.chart.type = chartType;
                    if (setUrl) {
                        $location.search("chartType", chartType);
                    }
                };

                $scope.switchPolar = function (isPolar, setUrl) {
                    $scope.highcharts.options.chart.polar = isPolar === true;
                    if (setUrl) {
                        $location.search("isPolar", isPolar === true);
                    }
                };

                $scope.switchLinear = function () {
                    $scope.highcharts.options.yAxis = $scope.highcharts.options.yAxis || {};
                    $scope.highcharts.options.yAxis.type = 'linear';
                };

                $scope.switchLog = function () {
                    $scope.highcharts.options.yAxis = $scope.highcharts.options.yAxis || {};
                    $scope.highcharts.options.yAxis.type = 'logarithmic';
                };

                $scope.setLang = function (language) {
                    $scope.language = language;
                };

                /******************/


                if ($view == "chart") {
                    $scope.showChart();
                    if ($chartType) {
                        $scope.switchChart($chartType);
                    }
                    if ($isPolar) {
                        $scope.switchPolar(true);
                    }
                }

                /****************/


                $scope.availableLanguages = ["cs", "en"];

                DataCubeService.getDatasets({ visualizationId: $id }, function () {

                });

                DataCubeService.getDataStructures({ visualizationId: $id }, function (data) {
                    $scope.dataStructures = data;

                    if ($scope.init && $permaToken) {
                        DataCubeService.getQuery({ visualizationId: $id, permalinkToken: $permaToken}, applyFilters);
                    }

                    $scope.init = false;
                });

                $scope.switchDSD = function (dsd, callback) {
                    $scope.dataStructures.forEach(function (ds) {
                        ds.isActive = false;
                    });
                    dsd.isActive = true;
                    $scope.activeDSD = dsd;
                    $scope.loadComponentsValues(callback);
                };

                function fillLabelsRegistry() {
                    $scope.activeDSD.components.forEach(function (c) {
                        ["dimension", "attribute", "measure"].forEach(function (type) {
                            if (c[type]) {
                                $scope.labelsRegistry[c[type].uri] = c.label;

                                if ($scope.values) {
                                    var values = $scope.values[c[type].uri];
                                    if (values) {
                                        values.forEach(function (v) {
                                            if (v.uri) {
                                                $scope.labelsRegistry[v.uri] = v.label;
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    });

                }

                $scope.loadComponentsValues = function (callback) {

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
                        fillLabelsRegistry();

                        if (callback) {
                            callback();
                        }
                    });
                };

                function label(uri) {
                    return $scope.labelsRegistry[uri] || uri;
                }

                function newChart() {
                    $scope.highcharts.series = [];
                    $scope.highcharts.xAxis = {categories: []};
                    $scope._series = [];
                    $scope._categories = {};
                }

                function addSeries(series) {
                    $scope._series.push(series);

                    ng.forEach(series.data, function (value, key) {
                        var categoryLabel = $scope.labelsRegistry[key] || key;
                        $scope._categories[categoryLabel] = 1;
                    });
                }

                function pushDataToChart() {
                    var sortedCategories = _.keys($scope._categories).sort();
                    var categoriesCount = sortedCategories.length;

                    var i = 0;
                    sortedCategories.forEach(function (c) {
                        $scope._categories[c] = i++;
                    });

                    $scope._series = $scope._series.map(function (series) {
                        var formattedData = {};

                        ng.forEach(series.data, function (value, key) {
                            var categoryLabel = $scope.labelsRegistry[key] || key;
                            formattedData[$scope._categories[categoryLabel]] = value;
                        });

                        var r = [];

                        for (var l = 0; l < categoriesCount; ++l) {
                            r.push(formattedData[l] || null);
                        }

                        return {name: series.name, data: r};
                    });

                    $scope._series = _.sortBy($scope._series, "name");

                    $scope.highcharts.series = $scope._series;
                    $scope.highcharts.xAxis.categories = sortedCategories;
                }

                $scope.refresh = function () {
                    if ($scope.slicesSelected) {

                        var search = {};
                        if ($scope.chartVisible) {
                            search.view = "chart";
                            search.chartType = $scope.highcharts.options.chart.type;
                            search.isPolar = $scope.highcharts.options.chart.polar === true;
                        }


                        DataCubeService.slices({visualizationId: $id}, {filters: collectFilters()}, function (response) {
                            search.p = response.permalinkToken;
                            $location.search(search);
                            $scope.permalink = window.location.href;

                            newChart();

                            if (response.cube && response.cube.slices) {
                                for (var k in response.cube.slices) {
                                    addSeries({name: label(k), data: response.cube.slices[k]});
                                }
                            }

                            pushDataToChart();
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

                $scope.toggleDimensionValue = function (value, override) {
                    if (typeof (override) !== "undefined") {
                        value.isActive = override || false;
                    } else {
                        value.isActive = !value.isActive;
                    }

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

                function applyFilters(data) {
                    var filters = data.filters;
                    var dsdUri = filters.dsdUri;

                    if (dsdUri) {
                        var dsd = _.find($scope.dataStructures, function (d) {
                            return d.uri == dsdUri;
                        });
                        if (dsd) {
                            $scope.switchDSD(dsd, function () {
                                applyDimensionFilters(data);
                            });
                        }
                    }
                }

                function applyDimensionFilters(data) {
                    var components = data.filters.components;
                    if (components) {
                        angular.forEach(components, function (c) {
                            if (c.type == "measure" && c.isActive) {
                                var measure = _.find($scope.activeDSD.components, function (adc) {
                                    return adc.measure && adc.measure.uri == c.componentUri;
                                });

                                if (measure) {
                                    $scope.toggleMeasure(measure);
                                }
                            } else {
                                var values = c.values;
                                if (values) {
                                    values.forEach(function (fValue) {
                                        if (fValue.isActive) {

                                            var cValue = _.find($scope.values[c.componentUri], function (cv) {
                                                if (typeof (cv.uri) !== "undefined") {
                                                    return cv.uri == fValue.uri;
                                                } else if (typeof (cv.label) !== "undefined") {
                                                    return cv.label == fValue.label;
                                                }
                                                return false;
                                            });

                                            if (cValue) {
                                                $scope.toggleDimensionValue(cValue, true);
                                            }
                                        }
                                    });
                                }

                            }
                        });

                        $scope.refresh();
                    }
                }
            }])
});