define(['angular', 'underscore'], function (ng, _) {
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

            }])
});