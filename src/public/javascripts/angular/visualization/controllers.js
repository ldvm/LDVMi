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
                        VisualizationService.query({skip: (params.page() - 1) * params.count(), take: params.count()}, function (data) {
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
            $scope.datasource = {};
            $scope.dsdDatasource = {};
            $scope.visualizationName = null;

            $scope.submit = function () {

                var addDataSource = function (ds, callback) {
                    DatasourceService.add(ds, callback);
                };

                var addVisualization = function (ds, dsdDs) {
                    VisualizationService.add({name: $scope.visualizationName, dataDataSource: ds.id, dsdDataSource: (dsdDs.id || ds.id)}, function (v) {
                        location.href = "/visualize/datacube#/id/" + v.id
                    });
                };

                var addDsdDataSource = function (ds) {
                    addDataSource($scope.dsdDatasource, function (dsdDs) {
                        addVisualization(ds, dsdDs);
                    });
                };

                var callback = $scope.dsdInSeparateDatasource ? addDsdDataSource : addVisualization;
                addDataSource($scope.datasource, callback);
            };

            $scope.anonymous = function(){
                $scope.visualizationName = "Visualization of " + $scope.datasource.endpointUri;
                $scope.submit();
            };
        }]);
});