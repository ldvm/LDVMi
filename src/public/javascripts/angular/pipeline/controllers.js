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
                    count: count,           // count per page
                    sorting: {
                        //name: 'asc'
                    }
                }, {
                    total: 0, // length of data
                    getData: function ($defer, params) {

                        var promise = pipelines.findPaginated(params.page(), params.count());
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

                var connection = $connection("ws://localhost:9000/api/v1/pipelines/discover");
                connection.listen(function () {
                    return true
                }, function (data) {
                    $scope.$apply(function () {
                        $scope.info.push(data);
                    });
                });
            }
        ]);
});