define(['angular', 'material', '../controllers'], function (ng, material) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('DataCubeValidator', [
            '$scope',
            '$routeParams',
            '$location',
            'Visualization',
            'Components',
            function (
                $scope,
                $routeParams,
                $location,
                visualization,
                components
            ) {

                var id = $scope.id = $routeParams.id;

                $scope.sources = [];

                $scope.validate = function () {
                    var promise = components.createDataSources($scope.sources);
                    promise.then(
                        function (result) {
                            visualization.dataCube.create(result.sourcesIds[0]).then(function (visualisationId) {
                                $location.path('/validator/dataCube/' + visualisationId.id);
                            });
                        },
                        function (errorMessage) {
                            alert(errorMessage + ' Terminating.');
                        }
                    )
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

                window.setTimeout(function () {
                    material.initForms();
                }, 0);

            }]);
});