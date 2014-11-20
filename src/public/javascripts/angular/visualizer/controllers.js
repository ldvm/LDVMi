define(['angular', 'underscorejs'], function (ng, _) {
    'use strict';

    ng.module('visualizer.controllers', []).
        controller('List',
        ['$scope', 'VisualizerService', '$routeParams', 'ngTableParams',
            function ($scope, $location, VisualizerService, $routeParams, ngTableParams) {

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
                        VisualizerService.query({
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
        .controller('Add', [
            '$scope', '$location', 'VisualizerService',
            function ($scope, $location, VisualizerService) {
                $scope.visualizer = {
                    features: [{}]
                };

                $scope.addFeature = function () {
                    $scope.visualizer.features.push({});
                };

                $scope.removeFeature = function ($index) {
                    $scope.visualizer.features.splice($index, 1);
                    if ($scope.visualizer.features.length < 1) {
                        $scope.addFeature();
                    }
                };

                $scope.submit = function () {
                    VisualizerService.save({}, $scope.visualizer, function (data) {
                        $location.path("#/list");
                    });
                };
            }]);
});