define(['angular', 'underscorejs'], function (ng, _) {
    'use strict';

    ng.module('visualizer.controllers', []).
        controller('List',
        ['$scope', 'VisualizerService', '$routeParams', 'ngTableParams',
            function ($scope, VisualizerService, $routeParams, ngTableParams) {

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
                        VisualizerService.query({skip: (params.page() - 1) * params.count(), take: params.count()}, function (data) {
                            params.total(data.count);
                            $defer.resolve(data.data);
                        });
                    }
                });

                $scope.time = function (a, b) {
                    return a || b;
                };

            }])
        .controller('Add', ['$scope', 'VisualizerService', function ($scope, VisualizerService) {
            $scope.visualizerName = null;
            $scope.visualizerUrl = null;
            $scope.visualizerSignature = null;
            $scope.visualizerDSDSignature = null;
            $scope.visualizerDescription = null;


            $scope.submit = function () {
                VisualizerService.save({
                    name: $scope.visualizerName,
                    url: $scope.visualizerUrl,
                    signature: $scope.visualizerSignature,
                    dsdSignature: $scope.visualizerDSDSignature,
                    description: $scope.visualizerDescription
                }, function(data){

                });
            };
        }]);
});