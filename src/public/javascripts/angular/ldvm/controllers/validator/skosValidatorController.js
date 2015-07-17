define(['angular', '../controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('SkosValidator', [
            '$scope',
            '$routeParams',
            '$location',
            'Visualization',
            'RdfUtils',
            function ($scope,
                      $routeParams,
                      $location,
                      visualization,
                      rdfUtils) {

                $scope.id = $routeParams.id;

                $scope.onUploadCompleted = function (lastId) {
                    if (lastId) {
                        visualization.skos.create(lastId).then(function (visualisationId) {
                            $location.path('/validator/skos/' + visualisationId.id);
                        });
                    }
                };

                if ($scope.id) {
                    var promise = visualization.skos.schemes($scope.id, true);
                    $scope.queryingDataset = true;
                    promise.then(function (schemes) {
                        $scope.schemes = schemes;
                        $scope.queryingDataset = false;
                    });

                    $scope.schemeExists = function (uri) {
                        return rdfUtils.resourceExists($scope.schemes, uri);
                    };

                    $scope.linkExists = function (uri) {
                        return rdfUtils.resourceExists($scope.concepts, uri);
                    };

                    $scope.uri = function (uri) {
                        return encodeURIComponent(uri)
                    };

                    var conceptsPromise = visualization.skos.concepts($scope.id, true);
                    $scope.queryingDataset = true;
                    conceptsPromise.then(function (concepts) {
                        $scope.concepts = concepts;
                        $scope.queryingDataset = false;
                    });
                }

            }]);
});