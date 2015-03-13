define(['angular', 'underscorejs', "d3js"], function (ng, _, d3) {
    'use strict';

    ng.module('pipeline.controllers', ['pipeline.model', 'websocket']).
        controller('List',
        ['$scope', 'Pipelines', '$routeParams', 'ngTableParams',
            function ($scope, pipelines, $routeParams, ngTableParams) {

                var page = $routeParams.page || 1;
                var count = $routeParams.count || 10;

                $scope.tableParams = new ngTableParams({
                    page: page,            // show first page
                    count: count,           // count per page,
                    filter: {
                        discoveryId: $routeParams.discoveryId
                    },
                    sorting: {
                        //name: 'asc'
                    }
                }, {
                    total: 0, // length of data
                    getData: function ($defer, params) {
                        var promise = pipelines.findPaginated(params.page(), params.count(), params.filter());
                        promise.then(function (data) {
                            params.total(data.count);
                            $defer.resolve(data.data);
                        });

                    }
                });

                $scope.time = function (a, b) {
                    return a || b;
                };

            }])
        .controller('CompatibilityCheck', function () {
        })
        .controller('Index', function ($scope) {
            $scope.visualize = function () {
                var uri = "/discover/";
                if ($scope.endpointUrl) {
                    uri += "?endpointUrl=" + $scope.endpointUrl;
                    if ($scope.showMore && $scope.graphUris) {
                        uri += "&graphUris=" + $scope.graphUris;
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
                $scope.isFinished = false;
                $scope.lastPerformedIteration = 0;
                $scope.pipelinesDiscoveredCount = 0;
                $scope.duration = 0;

                $scope.chartData = {
                    options: {
                        chart: {
                            type: 'line',
                            height: 200,
                            width: 300
                        }
                    },
                    series: [{name: "Pipelines count", data: []}],
                    title: {
                        text: 'Progress'
                    },
                    yAxis: {
                        title: {
                            text: ""
                        }
                    },
                    loading: false
                };

                var l = window.location;
                var uri = "ws://" + l.host + "/api/v1/pipelines/discover";
                if ("endpointUrl" in $routeParams && $routeParams.endpointUrl) {
                    uri += "?endpointUrl=" + $routeParams.endpointUrl;
                    if ("graphUris" in $routeParams && $routeParams.graphUris) {
                        uri += "&graphUris=" + $routeParams.graphUris;
                    }
                }
                var connection = $connection(uri);
                connection.listen(function () {
                    return true
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
                                $scope.chartData.series[0].data.push(data.pipelinesDiscoveredCount);
                            }
                        }
                    });
                });
            },

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

                        if(data.message && data.message == "==== DONE ===="){
                            $scope.info.unshift({});
                            $scope.info.unshift({message: "Pipeline evaluation is done. You are being redirected."});
                            window.setTimeout(function(){
                                window.location.href = "/pipelines#/detail/"+$routeParams.id;
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