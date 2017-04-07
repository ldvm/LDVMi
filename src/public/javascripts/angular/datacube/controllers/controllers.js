define(['angular', 'underscorejs'], function (ng, _) {
    'use strict';

    ng.module('datacube.controllers', []).controller('DataCube',
        ['$scope', 'DataCubeService', '$q', '$location', '$routeParams', '$timeout', '$filter',
            function ($scope, DataCubeService, $q, $location, $routeParams, $timeout, $filter) {

                var $id = $routeParams.id;
                var $permanentToken = $routeParams.p;
                var $view = $routeParams.view;
                var $chartType = $routeParams.chartType;
                var $isPolar = $routeParams.isPolar === "true";
                var $disableTitle = $routeParams.disableTitle === "true";

                if (!$id) {
                    return;
                }

                var dereferenced = {};
                var beingDereferenced = 0;

                var label = function (entity) {
                    var l = $filter('label')(entity, $scope.language, $scope.availableLanguages);
                    if (entity && l === entity.uri) {
                        if (entity.uri && !(entity.uri in dereferenced)) {
                            dereferenced[entity.uri] = 1;
                            ++beingDereferenced;
                        }
                    }
                    return l;
                };

                $scope.datasets = [];
                $scope.activeDataset = null;
                $scope.language = $routeParams.language || "nolang";
                $scope.measuresSelectedCount = 0;
                $scope.chartVisible = true;
                $scope.init = true;
                $scope.queryingDataset = null;

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
                    series: [],
                    title: {
                        text: 'DataCube'
                    },
                    subtitle: {
                        text: 'DataCube'
                    },
                    xAxis: {
                        title: {
                            enabled: true,
                            text: ""
                        },
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: ""
                        }
                    },
                    loading: false
                };

                $scope.entityRegistry = {};

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

                $scope.onLanguageChange = function (language) {
                    $scope.language = language;
                    $location.search("language", language);
                    $timeout(function () {
                        $scope.permalink = window.location.href;
                    });
                    sortValues();
                };

                function sortValues() {
                    _.forEach($scope.values, function (values, key) {
                        if (!key.startsWith('$')) {
                            $scope.values[key] = _.sortBy(values, function (v) {
                                return label(v);
                            });
                        }
                    });
                }

                $scope.switchLinear = function () {
                    $scope.highcharts.options.yAxis = $scope.highcharts.options.yAxis || {};
                    $scope.highcharts.options.yAxis.type = 'linear';
                };

                $scope.switchLog = function () {
                    $scope.highcharts.options.yAxis = $scope.highcharts.options.yAxis || {};
                    $scope.highcharts.options.yAxis.type = 'logarithmic';
                };

                if ($view == "chart") {
                    $scope.showChart();
                    if ($chartType) {
                        $scope.switchChart($chartType);
                    }
                    if ($isPolar) {
                        $scope.switchPolar(true);
                    }
                }

                $scope.availableLanguages = [];

                var registerLanguages = function (entity) {
                    if (!entity || !entity.label) {
                        return;
                    }
                    var languages = _.without(Object.keys(entity.label.variants), 'nolang');
                    $scope.availableLanguages = _.uniq($scope.availableLanguages.concat(languages));

                    if ($scope.language === "nolang" && $scope.availableLanguages.length) {
                        $scope.language = $scope.availableLanguages[0];
                    }
                };

                $scope.queryingDataset = "datasets";
                DataCubeService.getDatasets({visualizationId: $id}, function (datasets) {
                    $scope.datasets = datasets;
                    $scope.queryingDataset = null;

                    _.each(datasets, function (ds) {
                        registerLanguages(ds);
                    });

                    if ($scope.init && $permanentToken) {
                        $scope.loadByPermanentToken();
                    } else if (datasets.length === 1) {
                        $scope.switchDataset(datasets[0]);
                        $(".tm-chat").click();
                    } else {
                        $(".tm-chat").click();
                    }

                    $scope.init = false;
                }, function () {
                    $scope.queryingDataset = null;
                });

                $scope.loadByPermanentToken = function () {
                    $scope.queryingDataset = "chart data";
                    var promise = DataCubeService.getQuery({
                        visualizationId: $id,
                        permalinkToken: $permanentToken
                    }).$promise;
                    DataCubeService.getCached({visualizationId: $id, token: $permanentToken}, function (response) {
                        var callback;
                        if (response.error) {
                            callback = $scope.refresh;
                        } else {
                            callback = function () {
                                queryResultsLoaded(response, $location.search());
                            };
                        }

                        promise.then(function (data) {
                            $scope.queryingDataset = null;
                            applyFilters(data, callback);
                        });
                    }, function () {
                        $scope.queryingDataset = null;
                    });
                };

                $scope.loadDatasetStructure = function (dataset, callback) {
                    $scope.queryingDataset = "dataset structure";
                    DataCubeService.getStructure({id: $id, uri: dataset.uri}, function (data) {

                        console.log(data);

                        $scope.queryingDataset = null;
                        dataset.dataStructure = {components: data.components};

                        registerLanguages(data);

                        var measures = _.filter(dataset.dataStructure.components, function (c) {
                            return c.measure;
                        });

                        _.forEach(dataset.dataStructure.components, function (c) {
                            registerLanguages(c);
                        });

                        if (measures.length == 1) {
                            $scope.toggleMeasure(measures[0]);
                        }

                        callback();
                    }, function () {
                        $scope.queryingDataset = null;
                    });
                };

                $scope.switchDataset = function (dataset, callback) {
                    $scope.datasets.forEach(function (ds) {
                        ds.isActive = false;
                    });
                    dataset.isActive = true;
                    $scope.activeDataset = dataset;

                    registerLanguages(dataset);

                    $scope.loadDatasetStructure(dataset, function () {
                        $scope.loadComponentsValues(callback);
                    });
                };

                $scope.updateChartDescription = function () {
                    var activeMeasures = $scope.activeMeasures();
                    $scope.highcharts.title.text = $disableTitle ? "" : $scope.title();
                    $scope.highcharts.subtitle.text = $scope.subtitle(activeMeasures);
                    $scope.highcharts.yAxis.title.text = $scope.yAxisTitle(activeMeasures);
                    $scope.highcharts.xAxis.title.text = $scope.xAxisTitle(activeMeasures);
                };

                $scope.title = function () {
                    return label($scope.activeDataset);
                };

                $scope.subtitle = function (activeMeasures) {
                    if (activeMeasures.length == 1) {
                        return "";
                    }

                    return "";
                };

                $scope.yAxisTitle = function (activeMeasures) {
                    if (activeMeasures.length == 1) {
                        return label(activeMeasures[0]);
                    }
                    return "";
                };

                $scope.xAxisTitle = function () {
                    var xAxisComponent = _.chain($scope.activeDataset.dataStructure.components)
                        .filter(function (c) {
                            return c.dimension;
                        })
                        .sortBy(function (c) {
                            return -c.order;
                        })
                        .find(function (c) {
                            return $scope.dimensionValuesActiveCount[c.dimension.uri] > 1;
                        })
                        .value();

                    return label(xAxisComponent);
                };

                $scope.dimension = function (uri) {
                    return _.find($scope.activeDataset.dataStructure.components, function (c) {
                        return c.dimension && c.dimension.uri == uri
                    });
                };

                function fillEntityRegistry() {
                    $scope.activeDataset.dataStructure.components.forEach(function (c) {
                        ["dimension", "attribute", "measure"].forEach(function (type) {
                            if (c[type]) {
                                $scope.entityRegistry[c[type].uri] = c;

                                if ($scope.values) {
                                    var values = $scope.values[c[type].uri];
                                    if (values) {
                                        values.forEach(function (v) {
                                            if (v.uri) {
                                                $scope.entityRegistry[v.uri] = v;
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
                    $scope.activeDataset.dataStructure.components.forEach(function (c) {

                        function pushUri(component) {
                            if (component && component.uri) {
                                uris.push(component.uri);
                            }
                        }

                        pushUri(c.dimension);
                        pushUri(c.attribute);
                    });

                    $scope.queryingDataset = "distinct values of all QB components";
                    DataCubeService.getValues({visualizationId: $id}, {uris: uris}, function (data) {
                        $scope.queryingDataset = null;
                        $scope.values = data;

                        if (!$permanentToken) {
                            var dimensions = _.filter($scope.activeDataset.dataStructure.components, function (c) {
                                return c.dimension;
                            });
                            if (dimensions.length == 1) {
                                _.forEach(data[dimensions[0].dimension.uri], function (v) {
                                    v.isActive = true;
                                });
                                computeSlicing();
                                $scope.refresh();
                            }
                        }

                        fillEntityRegistry();

                        if (callback) {
                            callback();
                            sortValues();
                        }
                    }, function () {
                        $scope.queryingDataset = null;
                    });
                };

                function newChart() {
                    $scope.highcharts.series = [];
                    $scope.highcharts.xAxis.categories = [];
                    $scope._series = [];
                    $scope._categories = {};
                }

                function addSeries(series) {
                    $scope._series.push(series);

                    ng.forEach(series.data, function (value, key) {
                        var categoryLabel = label($scope.entityRegistry[key]) || key;
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
                            var categoryLabel = label($scope.entityRegistry[key]) || key;
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

                $scope.disableSettingsAndRefresh = function () {
                    $scope.settingsVisible = false;
                    $scope.refresh();
                };

                $scope.refresh = function () {
                    if ($scope.slicesSelected) {

                        var search = {};
                        if ($scope.chartVisible) {
                            search.view = "chart";
                            search.chartType = $scope.highcharts.options.chart.type;
                            search.isPolar = $scope.highcharts.options.chart.polar === true;
                            search.language = $scope.language;
                        }

                        $scope.queryingDataset = "chart data";
                        DataCubeService.slices({visualizationId: $id}, {filters: collectFilters()}, function (response) {
                            $scope.queryingDataset = null;
                            queryResultsLoaded(response, search);
                        }, function () {
                            $scope.queryingDataset = null;
                        });
                    }
                };

                function queryResultsLoaded(response, search) {
                    search.p = response.permalinkToken;
                    $location.search(search);
                    $timeout(function () {
                        $scope.permalink = window.location.href;
                    });

                    newChart();

                    var snapshot = beingDereferenced;

                    if (response.cube && response.cube.slices) {
                        for (var k in response.cube.slices) {
                            addSeries({name: label($scope.entityRegistry[k]) || k, data: response.cube.slices[k]});
                        }
                    }
                    $scope.updateChartDescription();
                    pushDataToChart();

                    if (beingDereferenced > snapshot) {
                        $scope.currentlyDereferencing = beingDereferenced - snapshot;
                        $timeout(function () {
                            $scope.currentlyDereferencing = 0;
                            queryResultsLoaded(response, search);
                        }, $scope.currentlyDereferencing * 500)
                    }

                }

                $scope.toggleMeasure = function (measureComponent, isActive) {
                    measureComponent.isActive = !(measureComponent.isActive || false);
                    if (isActive === true) {
                        measureComponent.isActive = true;
                    } else if (isActive === false) {
                        measureComponent.isActive = false;
                    }
                    $scope.measuresSelectedCount = $scope.activeMeasures().length;
                    computeSlicing();
                };

                $scope.activeMeasures = function () {
                    if (!$scope.activeDataset) {
                        return [];
                    }

                    return _.filter($scope.activeDataset.dataStructure.components, function (c) {
                        return c.measure && c.isActive;
                    });
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

                $scope.reorderComponents = function ($index, component, plusMinusOne) {
                    var components = $scope.activeDataset.dataStructure.components;
                    var currentOrder = component.order;
                    var newOrder = currentOrder + plusMinusOne;

                    if (newOrder > 0) {
                        var toUpdate = _.find(components, function (c) {
                            return c.dimension && c.order == newOrder;
                        });
                        if (toUpdate) {
                            toUpdate.order = currentOrder;
                            component.order = newOrder;
                        }
                    }
                };

                function computeSlicing() {

                    if (!$scope.values) {
                        return;
                    }

                    var dimensions = _.filter($scope.activeDataset.dataStructure.components, function (c) {
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
                        $scope.slicesSelected = dimensionsWithMultipleCount <= 2;
                    } else if ($scope.measuresSelectedCount > 1) {
                        $scope.slicesSelected = dimensionsWithMultipleCount == 1;
                    }

                    $scope.slicesSelected &= _.every($scope.dimensionValuesActiveCount, function (c) {
                        return c >= 1;
                    });
                }

                function collectFilters() {
                    var filters = {
                        datasetUri: $scope.activeDataset.uri,
                        components: []
                    };

                    var i = 100;
                    var componentsWithOrder = $scope.activeDataset.dataStructure.components.map(function (c) {
                        c.order = c.order || i++;
                        return c;
                    });

                    _.sortBy(componentsWithOrder, 'order')
                        .forEach(function (c) {
                            var componentProperty = c.dimension || c.measure || c.attribute;

                            if (componentProperty && componentProperty.uri) {
                                var filter = {
                                    componentUri: componentProperty.uri,
                                    order: c.order,
                                    isActive: c.isActive || false,
                                    type: c.dimension ? "dimension" : (c.measure ? "measure" : "attribute"),
                                    values: ($scope.values[componentProperty.uri] || []).map(function (v) {
                                        var r = {};
                                        if (v.uri) {
                                            r.uri = v.uri;
                                        } else {
                                            r.label = ((v.label || {})[$scope.language]) || ((v.label || {})[""]);
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

                function applyFilters(data, callback) {
                    var filters = data.filters;
                    var datasetUri = filters.datasetUri;

                    if (datasetUri) {
                        var dataset = _.find($scope.datasets, function (d) {
                            return d.uri == datasetUri;
                        });
                        if (dataset) {
                            $scope.switchDataset(dataset, function () {
                                applyDimensionFilters(data, callback);
                            });
                        }
                    }
                }

                function applyDimensionFilters(data, callback) {
                    var components = data.filters.components;
                    if (components) {
                        ng.forEach(components, function (c) {
                            if (c.type === "measure") {
                                if (c.isActive) {
                                    var measure = _.find($scope.activeDataset.dataStructure.components, function (adc) {
                                        return adc.measure && adc.measure.uri == c.componentUri;
                                    });

                                    if (measure) {
                                        $scope.toggleMeasure(measure, true);
                                    }
                                }
                            } else {

                                if (c.type === "dimension") {
                                    var component = _.find($scope.activeDataset.dataStructure.components, function (adc) {
                                        return adc.dimension && adc.dimension.uri == c.componentUri;
                                    });
                                }

                                component.order = c.order || component.order;

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

                        if (callback) {
                            callback();
                        }
                    }
                }
            }])
});
