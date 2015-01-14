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
        .controller('CompatibilityCheck', function(){})
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

                $scope.data = {
                    "nodes": [],
                    "links": []
                };

                pipelines.visualization($routeParams.id).then(function (data) {
                    $scope.data = data;
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

                var connection = $connection("ws://localhost:9000/api/v1/pipelines/discover");
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
            }
        ]);
});