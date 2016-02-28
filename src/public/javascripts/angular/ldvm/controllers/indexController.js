define(['angular', 'material', 'underscorejs', 'underscore.string', './controllers'], function (ng, material, _, _s) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Index', ['$scope', 'Components', 'Pipelines', '$q', '$connection',
            function ($scope, components, pipelines, $q, $connection) {

                $scope.showInput = true;
                $scope.redirect = false;

                $scope.runningDiscovery = null;
                $scope.pipelinesDiscovered = 0;
                $scope.discoveryId = null;
                $scope.discoveryFinished = false;

                $scope.evaluatingPipeline = false;
                $scope.evaluationDuration = 0;
                $scope.evaluationId = null;
                $scope.evaluationFinished = false;

                $scope.sources = [
                    {
                        type: 'sparqlEndpoint',
                        endpointUrl: 'http://linked.opendata.cz/sparql',
                        graphUris: null
                    }
                ];

                $scope.add = function (type) {
                    $scope.sources.push({type: type});
                };

                $scope.remove = function (source) {
                    var index = $scope.sources.indexOf(source);
                    $scope.sources.splice(index, 1);
                };

                $scope.visualize = function (feelsLucky) {
                    var validDataSources = _.filter($scope.sources, function (source) {
                        return isValidDataSource(source);
                    });

                    var dataSourcesByType = _.groupBy(validDataSources, 'type');
                    var promises = _.map(dataSourcesByType, function (dataSources, type) {
                        return createDataSources(type, dataSources);
                    });

                    $q.all(promises).then(function (data) {
                        var dataSourceIds = _.flatten(data).map(function (d) {
                            return d.id;
                        });
                        runDiscovery(dataSourceIds, feelsLucky);
                    });
                };

                function runDiscovery(dataSourceIds, feelsLucky) {
                    var uri = "ws://" + window.location.host + "/api/v1/pipelines/discover";
                    var queryString = dataSourceIds.map(function (p) {
                        return "dataSourceTemplateIds=" + p;
                    });

                    uri += "?" + queryString.join("&");

                    $scope.showInput = false;
                    $scope.runningDiscovery = true;
                    $scope.pipelinesDiscovered = 0;
                    $scope.discoveryId = null;
                    $scope.discoveryFinished = false;
                    $scope.pipline = null;

                    var connection = $connection(uri);
                    connection.listen(
                        function () {
                            return true;
                        },
                        function (message) {

                            if ("pipelinesDiscoveredCount" in message) {
                                $scope.$apply(function () {
                                    $scope.pipelinesDiscovered = message.pipelinesDiscoveredCount;
                                });
                            }

                            if ("isFinished" in message) {
                                if (!$scope.discoveryId) {
                                    $scope.$apply(function () {
                                        $scope.discoveryId = message.id;
                                    });
                                }

                                if (message.isFinished) {
                                    if (message.isSuccess) {
                                        discoveryDone(feelsLucky);
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.showInput = true;
                                        });
                                    }
                                    $scope.$apply(function () {
                                        $scope.runningDiscovery = false;
                                    });
                                }
                            }
                        }
                    );
                }

                function discoveryDone(feelsLucky) {
                    $scope.$apply(function () {
                        $scope.discoveryFinished = true;
                    });

                    if ($scope.pipelinesDiscovered === 1 || (feelsLucky && $scope.pipelinesDiscovered >= 1)) {
                        pipelines.getSingle($scope.discoveryId).then(function (pipeline) {
                            $scope.pipeline = pipeline;
                            evaluatePipeline(pipeline);
                        });
                    } else {
                        $scope.$apply(function () {
                            $scope.redirect = true;
                        });
                        window.setTimeout(function () {
                            window.location.href = "/pipelines#/list?quick=1&discoveryId=" + $scope.discoveryId;
                        }, 2000);
                    }
                }

                function evaluatePipeline(pipeline) {
                    var uri = "ws://" + window.location.host + "/api/v1/pipelines/evaluate/" + pipeline.id;

                    $scope.evaluatingPipeline = true;
                    $scope.evaluationDuration = 0;
                    $scope.evaluationId = null;
                    $scope.evaluationFinished = false;

                    var connection = $connection(uri);
                    connection.listen(
                        function () {
                            return true;
                        },
                        function (message) {

                            if (message.id) {
                                $scope.evaluationId = message.id;
                            }

                            if (message.message === '==== DONE ====') {
                                $scope.$apply(function () {
                                    $scope.redirect = true;
                                    $scope.evaluationFinished = true;
                                });
                                window.setTimeout(function () {
                                    window.location.href = "/visualize/" + $scope.evaluationId;
                                }, 2000);
                            }
                        }
                    );
                }

                function createDataSources(type, dataSources) {
                    switch (type) {
                        case 'sparqlEndpoint':
                            return createSparqlEndpoints(dataSources);
                        case 'url':
                            return createFromUrl(source);
                        case 'file':
                            return createByFileUpload(source);
                    }
                }

                function isValidDataSource(source) {
                    switch (source.type) {
                        case 'sparqlEndpoint':
                            return isValidSparqlEndpoint(source);
                        case 'url':
                            return isValidUrl(source);
                        case 'file':
                            return isValidFileUpload(source);
                    }

                    return false;
                }

                function isValidSparqlEndpoint(source) {
                    return source.endpointUrl && source.endpointUrl.length > "http://".length;
                }

                function isValidUrl(source) {
                    return source.url && source.url.length > "http://";
                }

                function isValidFileUpload(source) {
                    return true;
                }

                function createSparqlEndpoints(sources) {
                    var sourcesForApi = sources.map(function (e) {
                        return {
                            endpointUrl: e.endpointUrl,
                            graphUris: e.graphUris ? e.graphUris.split(/\s+/) : undefined
                        };
                    });

                    return components.createSparqlEndpoints(sourcesForApi);
                }

                function createFromUrl(sources) {
                    var urls = sources.map(function (s) {
                        return s.url;
                    });

                    return components.createFromUrls(urls);
                }

                function createByFileUpload(source) {

                }

                window.setTimeout(function () {
                    material.initForms();
                }, 0);
            }]);
});