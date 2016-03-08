define(['angular', 'material', 'underscorejs', 'jquery', './controllers'], function (ng, material, _, $) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Index', ['$scope', 'Components', 'Visualization', 'Pipelines', '$timeout',
            function ($scope, components, visualization, pipelines, $timeout) {

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

                $scope.$parent.showChatButton = false;

                $scope.sources = [
                    {type: 'url'},
                    {type: 'file'},
                    {type: 'sparqlEndpoint'}
                ];

                function example(source) {
                    $scope.sources = [source];
                    window.setTimeout(function () {
                        $("form").find("input, textarea").focus();
                    });
                }

                $scope.example01 = function () {
                    example({
                        type: 'url',
                        url: 'http://visualization.linkedpipes.com/example/datacube.ttl http://visualization.linkedpipes.com/example/dsd.ttl'
                    });
                };

                $scope.example02 = function () {
                    example({
                        type: 'url',
                        url: 'http://publications.europa.eu/mdr/resource/authority/eu-programme/skos/eu-programme-skos.rdf'
                    });
                };

                $scope.example03 = function () {
                    example({
                        type: 'sparqlEndpoint',
                        endpointUrl: 'http://linked.opendata.cz/sparql'
                    });
                };

                $scope.example04 = function () {
                    example({
                        type: 'sparqlEndpoint',
                        endpointUrl: 'http://linked.opendata.cz/sparql',
                        graphUris: 'http://comsode.eu/resource/dataset/COMSODE_D3.2'
                    });
                };

                $scope.visualize = function (feelsLucky) {
                    $scope.creatingDatasources = true;
                    $scope.datasourcesCreated = false;
                    $scope.showInput = false;

                    var promise = components.createDataSources($scope.sources);
                    promise.then(
                        function (result) {
                            $scope.validDataSources = result.validSources;
                            runDiscovery(result.sourcesIds, feelsLucky);
                        },
                        function (errorMessage) {
                            alert(errorMessage + ' Terminating.');
                            $scope.showInput = true;
                        }
                    )
                };

                function runDiscovery(dataSourceIds, feelsLucky) {

                    $scope.creatingDatasources = false;
                    $scope.datasourcesCreated = true;
                    $scope.runningDiscovery = true;
                    $scope.pipelinesDiscovered = 0;
                    $scope.discoveryId = null;
                    $scope.discoveryFinished = false;
                    $scope.pipline = null;

                    var onPipelinesCountChanged = function (count) {
                        $scope.$apply(function () {
                            $scope.pipelinesDiscovered = count;
                        });
                    };

                    var onProgress = function (message) {
                        if (!$scope.discoveryId) {
                            $scope.$apply(function () {
                                $scope.discoveryId = message.id;
                            });
                        }
                    };

                    var errors = [];

                    var onDone = function (isSuccess) {
                        if (isSuccess) {
                            discoveryDone(feelsLucky);
                        } else {
                            alert('Discovery failed to find a visualization. Please, check that the input is valid and try again.\n\n' + errors.join('\n'));
                            $scope.$apply(function () {
                                $scope.showInput = true;
                            });
                        }
                        $scope.$apply(function () {
                            $scope.runningDiscovery = false;
                        });
                    };

                    visualization.discovery.run(
                        dataSourceIds,
                        onPipelinesCountChanged,
                        onProgress,
                        onDone,
                        errors
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

                    $scope.evaluatingPipeline = true;
                    $scope.evaluationDuration = 0;
                    $scope.evaluationId = null;
                    $scope.evaluationFinished = false;

                    var onEvaluationIdAssigned = function (evaluationId) {
                        $scope.$apply(function () {
                            $scope.evaluationId = evaluationId;
                        });
                    };

                    var onDone = function () {
                        $scope.$apply(function () {
                            $scope.redirect = true;
                            $scope.evaluationFinished = true;
                        });
                        if ($scope.evaluationId) {
                            window.setTimeout(function () {
                                window.location.href = "/visualize/" + $scope.evaluationId;
                            }, 2000);
                        }
                    };

                    pipelines.evaluate(pipeline, onEvaluationIdAssigned, onDone);
                }

                window.setTimeout(function () {
                    material.initForms();
                }, 0);

            }]);
});