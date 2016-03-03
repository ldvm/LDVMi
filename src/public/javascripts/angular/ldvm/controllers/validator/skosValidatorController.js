define(['angular', 'underscorejs', '../controllers'], function (ng, _) {
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

                    var schemeExists = $scope.schemeExists = function (uri) {
                        return rdfUtils.resourceExists($scope.schemes, uri);
                    };

                    var linkValid = $scope.linkValid = function (uri) {
                        return rdfUtils.resourceExists($scope.concepts, uri);
                    };

                    var uri = $scope.uri = function (uri) {
                        return encodeURIComponent(uri)
                    };

                    var conceptsPromise = visualization.skos.concepts($scope.id, true);
                    $scope.queryingDataset = true;
                    conceptsPromise.then(function (concepts) {
                        $scope.concepts = concepts;
                        $scope.queryingDataset = false;

                        validate(concepts);
                    });
                }

                $scope.showDetailOfConcept = null;

                $scope.showDetailOf = function (concept) {
                    $scope.showDetailOfConcept = concept;
                };

                function validate(concepts) {
                    $scope.validConcepts = [];
                    $scope.conceptsWithoutScheme = [];
                    $scope.conceptsNotMatchingScheme = [];
                    $scope.conceptsWithBrokenLinks = {};

                    _.each(concepts, function (concept) {
                        var hasError = false;

                        if (!concept.schemeUri) {
                            hasError = true;
                            $scope.conceptsWithoutScheme.push(concept);
                        } else if (schemeExists(concept)) {
                            hasError = true;
                            $scope.conceptsNotMatchingScheme.push(concept);
                        }

                        _.each(concept.linkUris, function (link, property) {
                            if (!linkValid(link)) {
                                hasError = true;
                                $scope.conceptsWithBrokenLinks[property] = $scope.conceptsWithBrokenLinks[property] || [];
                                $scope.conceptsWithBrokenLinks[property].push(concept);
                            }
                        });

                        if (!hasError) {
                            $scope.validConcepts.push(concept);
                        }
                    });
                }

            }]);
});