define(['angular', 'underscorejs'], function (ng, _) {
    'use strict';

    ng.module('visualizationList.controllers', []).
        controller('List',
        ['$scope', 'VisualizationService', '$routeParams', 'ngTableParams',
            function ($scope, VisualizationService, $routeParams, ngTableParams) {

                var page = $routeParams.page || 1;
                var count = $routeParams.count || 10;

                $scope.tableParams = new ngTableParams({
                    page: page,            // show first page
                    count: count,           // count per page
                    sorting: {
                        name: 'asc'
                    }
                }, {
                    total: 0, // length of data
                    getData: function ($defer, params) {
                        VisualizationService.query({
                            skip: (params.page() - 1) * params.count(),
                            take: params.count()
                        }, function (data) {
                            params.total(data.count);
                            $defer.resolve(data.data);
                        });
                    }
                });

                $scope.time = function (a, b) {
                    return a || b;
                };

            }])
        .controller('Add', ['$scope', 'VisualizationService', 'DatasourceService', function ($scope, VisualizationService, DatasourceService) {
            $scope.dsdInSeparateDatasource = false;
            $scope.datasources = [{}];
            $scope.visualizationName = null;

            $scope.submit = function () {

                VisualizationService.add({
                    name: $scope.visualizationName,
                    datasource: $scope.datasources
                }, function (v) {
                    location.href = "#/compatibility/check/" + v.id
                });

            };

            $scope.addDatasource = function () {
                $scope.datasources.push({});
            };

            $scope.removeDatasource = function ($index) {
                $scope.datasources.splice($index, 1);
            };

            $scope.anonymous = function () {
                $scope.visualizationName = "Visualization of " + $scope.datasource.endpointUri;
                $scope.submit();
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

            }]);
});