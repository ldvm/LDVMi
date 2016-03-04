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

                $scope.creatingDatasources = false;
                $scope.datasourcesCreated = false;

                $scope.sources = [
                    {type: 'url'},
                    {type: 'file'},
                    {type: 'sparqlEndpoint'}
                ];

                $scope.example01 = function(){
                    $scope.sources = [
                        {
                            type: 'url',
                            url: 'http://visualization.linkedpipes.com/example/datacube.ttl http://visualization.linkedpipes.com/example/dsd.ttl'
                        }
                    ];
                };

                $scope.example02 = function(){
                    $scope.sources = [
                        {
                            type: 'url',
                            url: 'http://publications.europa.eu/mdr/resource/authority/eu-programme/skos/eu-programme-skos.rdf'
                        }
                    ];
                };

                $scope.example03 = function(){
                    $scope.sources = [
                        {
                            type: 'sparqlEndpoint',
                            endpointUrl: 'http://linked.opendata.cz/sparql'
                        }
                    ];
                };

                $scope.add = function (type) {
                    $scope.sources.push({type: type});
                };

                $scope.remove = function (source) {
                    var index = $scope.sources.indexOf(source);
                    $scope.sources.splice(index, 1);
                };

                $scope.visualize = function (feelsLucky) {
                    $scope.creatingDatasources = true;
                    $scope.datasourcesCreated = false;
                    $scope.showInput = false;

                    var validDataSources = $scope.validDataSources = _.filter($scope.sources, function (source) {
                        return isValidDataSource(source);
                    });

                    if (validDataSources.length === 0) {
                        alert('No valid data sources given. Terminating.');
                        $scope.showInput = true;
                    } else {
                        var promises = _.map(validDataSources, function (dataSource) {
                            return createDataSource(dataSource);
                        });

                        $q.all(promises).then(function (data) {
                            var dataSourceIds = _.flatten(data).map(function (d) {
                                return d.id;
                            });
                            runDiscovery(dataSourceIds, feelsLucky);
                        });
                    }
                };

                function runDiscovery(dataSourceIds, feelsLucky) {
                    var uri = "ws://" + window.location.host + "/api/v1/pipelines/discover";
                    var queryString = dataSourceIds.map(function (p) {
                        return "dataSourceTemplateIds=" + p;
                    });

                    uri += "?" + queryString.join("&");

                    $scope.creatingDatasources = false;
                    $scope.datasourcesCreated = true;
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

                function createDataSource(source) {
                    switch (source.type) {
                        case 'sparqlEndpoint':
                            return createSparqlEndpoints(source);
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
                    return source.url && source.url.length > "http://".length;
                }

                function isValidFileUpload(source) {
                    return source.files && source.files.length;
                }

                function createSparqlEndpoints(source) {
                    var sourcesForApi = [{
                        endpointUrl: source.endpointUrl,
                        graphUris: source.graphUris ? source.graphUris.split(/\s+/).map(urlTrim) : undefined
                    }];

                    return components.createSparqlEndpoints(sourcesForApi);
                }

                function createFromUrl(source) {
                    var urls = source.url ? source.url.split(/\s+/).map(urlTrim) : undefined;
                    return components.createFromUrls(urls);
                }

                function createByFileUpload(source) {
                    return components.createByFileUpload(source.files);
                }

                window.setTimeout(function () {
                    material.initForms();
                }, 0);

                function urlTrim(str) {
                    return trim(str, '\n\r\t "\',;');
                }

                var trim = (function () {
                    "use strict";

                    function escapeRegex(string) {
                        return string.replace(/[\[\](){}?*+\^$\\.|\-]/g, "\\$&");
                    }

                    return function trim(str, characters, flags) {
                        flags = flags || "g";
                        if (typeof str !== "string" || typeof characters !== "string" || typeof flags !== "string") {
                            throw new TypeError("argument must be string");
                        }

                        if (!/^[gi]*$/.test(flags)) {
                            throw new TypeError("Invalid flags supplied '" + flags.match(new RegExp("[^gi]*")) + "'");
                        }

                        characters = escapeRegex(characters);

                        return str.replace(new RegExp("^[" + characters + "]+|[" + characters + "]+$", flags), '');
                    };
                }());
            }]);
});