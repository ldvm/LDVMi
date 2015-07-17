define(['angular', '../controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('DataCubeValidator', [
            '$scope',
            '$routeParams',
            '$location',
            'Visualization',
            function ($scope,
                      $routeParams,
                      $location,
                      visualization) {

                var id = $scope.id = $routeParams.id;

                $scope.onUploadCompleted = function (lastId) {
                    if (lastId) {
                        visualization.dataCube.create(lastId).then(function (visualisationId) {
                            $location.path('/validator/dataCube/' + visualisationId.id);
                        });
                    }
                };

                function query(promise) {
                    $scope.queryingDataset = true;
                    return promise.then(function (data) {
                        $scope.queryingDataset = false;
                        return data;
                    });
                }

                if (id) {
                    query(visualization.dataCube.dataStructures(id)).then(function (structures) {
                        $scope.dataStructures = structures;

                        if (structures.length === 1) {
                            $scope.dsd = structures[0];
                        }
                    });
                }

                $scope.setDsd = function (structure) {
                    $scope.dsd = structure;
                };

                $scope.$watch('dsd', function (newVal) {
                    if (newVal) {
                        var uri = newVal.uri;
                        if (uri) {
                            var isTolerant = true;
                            query(visualization.dataCube.dataStructureComponents(id, uri, isTolerant)).then(function (data) {
                                $scope.components = data.components;
                            });
                        }
                    }
                });

            }]);
});