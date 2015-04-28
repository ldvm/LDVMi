define(['angular', 'underscorejs', "d3js"], function (ng, _, d3) {
    'use strict';

    ng.module('pipeline.controllers', ['pipeline.model', 'websocket']).
        controller('List',
        ['$scope', 'Pipelines', '$routeParams', 'ngTableParams',
            function ($scope, pipelines, $routeParams, ngTableParams) {

                $scope.page = $routeParams.page || 1;
                $scope.count = $routeParams.count || 50;
                $scope.filter = {
                    discoveryId: $routeParams.discoveryId,
                    visualizerId: $routeParams.visualizerId
                };
                $scope.total = 0;

                $scope.pages = function () {
                    var num = Math.ceil($scope.total / $scope.count);
                    return Array.apply(null, Array(num)).map(function (_, i) {
                        return i;
                    });
                };

                var showPagination = !($routeParams.discoveryId || $routeParams.visualizerId);

                $scope.pipelines = [];

                var getPipelines = function () {
                    var promise = pipelines.findPaginated($scope.page, $scope.count, $scope.filter);
                    promise.then(function (data) {
                        $scope.total = (showPagination ? data.count : data.data.length);
                        $scope.pipelines = data.data;
                    });
                };

                $scope.$watch('page', getPipelines);

                $scope.time = function (a, b) {
                    return a || b;
                };

            }])
        .controller('CompatibilityCheck', [
            '$scope', '$routeParams', '$connection',
            function ($scope, $routeParams, $connection) {

                $scope.info = [];
                $scope.descriptorsCompatibility = [];

                var pipelineId = $routeParams.id;
                var l = window.location;
                var url = "ws://" + l.host + "/api/v1/compatibility/check/" + pipelineId;

                var connection = $connection(url);
                connection.listen(function () {
                    return true;
                }, function (data) {
                    $scope.$apply(function () {
                        if ("isCompatible" in data) {
                            $scope.descriptorsCompatibility.push(data);
                        } else {
                            $scope.info.unshift(data);
                        }

                        $scope.info.splice(100);
                    });
                });


            }])
        .controller('Index', function ($scope) {
            $scope.visualize = function () {
                var uri = "/discover/";
                if ($scope.endpointUrl) {
                    uri += "?endpointUrl=" + $scope.endpointUrl;
                    if ($scope.showMore && $scope.graphUris) {
                        uri += "&graphUris=" + $scope.graphUris;
                    }
                    if ($scope.showMore && $scope.combine) {
                        uri += "&combine=1";
                    }
                }
                window.location.href = uri;
            };
        })
        .controller('Compatibility', [
            '$scope', '$routeParams', 'Compatibility', 'VisualizationService',
            function ($scope, $routeParams, Compatibility, VisualizationService) {

                $scope.checking = false;

                if ($routeParams.command) {
                    if ($routeParams.command === 'check') {
                        $scope.checking = true;
                    }
                }

                $scope.time = function (a, b) {
                    return a || b;
                };

                VisualizationService.get({id: $routeParams.id}, function (data) {
                    $scope.visualizationBox = data;
                });

                Compatibility.get({id: $routeParams.id}, function (data) {
                    $scope.compatibilityBoxes = data;
                });

                if ($scope.checking) {
                    Compatibility.check({id: $routeParams.id}, function (data) {
                        window.setTimeout(function () {
                            window.location.href = "#/compatibility/" + $routeParams.id;
                        }, 5000);
                    });
                }

            }])
        .controller('Detail', [
            '$scope', '$routeParams', 'Pipelines',
            function ($scope, $routeParams, pipelines) {

                $scope.pipelineId = $routeParams.id;

                $scope.data = {
                    "nodes": [],
                    "links": []
                };

                pipelines.visualization($routeParams.id).then(function (data) {
                    $scope.data = data;
                });

                pipelines.evaluations($routeParams.id).then(function (data) {
                    $scope.evaluations = data.data;
                });

            }])
        .controller('Discover', [
            '$scope', '$routeParams', 'Pipelines', '$connection',
            function ($scope, $routeParams, pipelines, $connection) {

                $scope.info = [];
                $scope.checks = [];
                $scope.portChecks = [];

                $scope.isFinished = false;
                $scope.lastPerformedIteration = 0;
                $scope.pipelinesDiscoveredCount = 0;
                $scope.duration = 0;

                $scope.data = [];

                var l = window.location;
                var uri = "ws://" + l.host + "/api/v1/pipelines/discover";
                if ("dataSourceTemplateId" in $routeParams && $routeParams.dataSourceTemplateId) {
                    uri += "?dataSourceTemplateId=" + $routeParams.dataSourceTemplateId;
                    if ($routeParams.combine && $routeParams.combine > 0) {
                        uri += "&combine=true";
                    }
                }
                var connection = $connection(uri);
                connection.listen(function () {
                    return true;
                }, function (data) {
                    $scope.$apply(function () {
                        $scope.info.unshift(data);

                        if ("isFinished" in data) {
                            $scope.isFinished = data.isFinished;
                            $scope.lastPerformedIteration = data.lastPerformedIteration;
                            $scope.isSuccess = data.isSuccess;
                            $scope.pipelinesDiscoveredCount = data.pipelinesDiscoveredCount;

                            if ("createdUtc" in data && "modifiedUtc" in data) {
                                $scope.duration = data.modifiedUtc - data.createdUtc;
                            }

                            if ("pipelinesDiscoveredCount" in data) {
                                $scope.data.push([$scope.lastPerformedIteration, data.pipelinesDiscoveredCount]);
                            }

                            if (data.isFinished && data.isSuccess) {
                                //window.location.href = "/pipelines#/list?discoveryId="+data.id;
                            }
                        }

                        if("descriptor" in data){
                            $scope.checks.unshift(data);
                        }

                        if("portOwnerComponentUri" in data){
                            $scope.portChecks.unshift(data);
                        }

                        $scope.info.splice(100);
                    });
                });
            }

        ])
        .controller('Evaluate', [
            '$scope', '$routeParams', 'Pipelines', '$connection',
            function ($scope, $routeParams, pipelines, $connection) {

                $scope.info = [];
                $scope.isFinished = false;
                $scope.duration = 0;

                var l = window.location;
                var connection = $connection("ws://" + l.host + "/api/v1/pipelines/evaluate/" + $routeParams.id);
                connection.listen(function () {
                    return true
                }, function (data) {
                    $scope.$apply(function () {
                        $scope.info.unshift(data);

                        if (data.message && data.message == "==== DONE ====") {
                            $scope.info.unshift({});
                            $scope.info.unshift({message: "Pipeline evaluation is done. You are being redirected."});
                            window.setTimeout(function () {
                                window.location.href = "/pipelines#/detail/" + $routeParams.id;
                            }, 2000);
                        }

                        if ("isFinished" in data) {
                            $scope.isFinished = data.isFinished;
                            $scope.isSuccess = data.isSuccess;

                            if ("createdUtc" in data && "modifiedUtc" in data) {
                                $scope.duration = data.modifiedUtc - data.createdUtc;
                            }
                        }
                    });
                });
            },

        ]);
});