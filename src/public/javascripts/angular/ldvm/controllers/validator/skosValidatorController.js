define(['angular', 'material', 'underscorejs', '../controllers'], function (ng, material, _) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('SkosValidator', [
            '$scope',
            '$routeParams',
            '$location',
            'Visualization',
            'RdfUtils',
            'Components',
            function ($scope,
                      $routeParams,
                      $location,
                      visualization,
                      rdfUtils,
                      components) {

                $scope.id = $routeParams.id;

                $scope.sources = [];

                function example(source) {
                    $scope.sources = [source];
                    window.setTimeout(function () {
                        material.initForms();
                        $("form").find("input, textarea").focus();
                    });
                }

                $scope.example01 = function () {
                    example({
                        type: 'url',
                        url: 'https://raw.githubusercontent.com/linkedpipes/visualizations/gh-pages/example/broken-skos.ttl'
                    });
                };

                $scope.showLoader = false;

                $scope.validate = function () {
                    $scope.showLoader = true;
                    var promise = components.createDataSources($scope.sources);
                    promise.then(
                        function (result) {
                            visualization.skos.create(result.sourcesIds[0]).then(function (visualisationId) {
                                $location.path('/validator/skos/' + visualisationId.id);
                            }, function () {
                                $scope.showLoader = false;
                            });
                        },
                        function (errorMessage) {
                            $scope.showLoader = false;
                            alert(errorMessage + ' Terminating.');
                        }
                    )
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

                    $scope.uri = function (uri) {
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