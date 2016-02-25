define(['angular', 'material', 'underscorejs', 'underscore.string', './controllers'], function (ng, material, _, _s) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Index', ['$scope', 'Components', 'Pipelines', '$q', '$connection',
            function ($scope, components, pipelines, $q, $connection) {

                $scope.runningDiscovery = null;
                $scope.pipelinesDiscovered = 0;
                $scope.discoveryId = null;

                $scope.sources = [
                    {
                        type: 'sparqlEndpoint',
                        endpointUrl: 'http://linked.opendata.cz/sparql',
                        graphUris: null
                    }
                ];

                $scope.add = function (type) {
                    $scope.sources.push({type: type})
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

                $scope.waiting = function () {
                    return $scope.runningDiscovery || $scope.runningEvaluation;
                };

                function runDiscovery(dataSourceIds, feelsLucky) {
                    var uri = "ws://" + window.location.host + "/api/v1/pipelines/discover";
                    var queryString = dataSourceIds.map(function (p) {
                        return "dataSourceTemplateIds=" + p;
                    });

                    uri += "?" + queryString.join("&");

                    $scope.runningDiscovery = true;
                    $scope.pipelinesDiscovered = 0;
                    $scope.discoveryId = null;

                    var connection = $connection(uri);
                    connection.listen(
                        function () {
                            return true;
                        },
                        function (message) {

                            if ("pipelinesDiscoveredCount" in message) {
                                $scope.pipelinesDiscovered = message.pipelinesDiscoveredCount;
                            }

                            if ("isFinished" in message) {
                                if (!$scope.discoveryId) {
                                    $scope.discoveryId = message.id;
                                }

                                if (message.isFinished) {
                                    if (message.isSuccess) {
                                        discoveryDone(feelsLucky);
                                    } else {
                                        console.log("failed");
                                    }
                                    $scope.runningDiscovery = false;
                                }
                            }
                        }
                    )
                }

                function discoveryDone(feelsLucky) {
                    if ($scope.pipelinesDiscovered === 1 || feelsLucky) {
                        console.log("evaluate pipeline");
                    } else {
                        window.location.href = "/pipelines#/list?discoveryId=" + $scope.discoveryId;
                    }
                }

                function createDataSources(type, dataSources) {
                    switch (type) {
                        case 'sparqlEndpoint':
                            return createSparqlEndpoints(dataSources);
                    }
                }

                function isValidDataSource(source) {
                    switch (source.type) {
                        case 'sparqlEndpoint':
                            return isValidSparqlEndpoint(source);
                    }

                    return false;
                }

                function isValidSparqlEndpoint(source) {
                    return source.endpointUrl && source.endpointUrl.length > "http://".length;
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

                window.setTimeout(function () {
                    material.initForms();
                }, 0);
            }]);
});