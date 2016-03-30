define(['angular', 'underscorejs', './controllers'], function (ng, _) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Hierarchy',
            [
                '$scope',
                '$location',
                '$routeParams',
                'Visualization',
                function ($scope,
                          $location,
                          $routeParams,
                          visualization) {

                    var id = $scope.id = $routeParams.id;
                    if (!id) {
                        return;
                    }

                    $scope.visType = $routeParams.type;

                    $scope.schemes = [];
                    $scope.selectedScheme = null;
                    $scope.queryingDataset = null;
                    $scope.loadingSchemesList = false;

                    var promise = visualization.skos.schemes(id);
                    $scope.queryingDataset = true;
                    $scope.loadingSchemesList = true;

                    promise.then(function (schemes) {
                        $scope.schemes = schemes;
                        $scope.queryingDataset = false;
                        $scope.loadingSchemesList = false;

                        if (!$routeParams.uri) {
                            $scope.loadScheme($scope.schemes[0]);
                        }
                    });

                    $scope.language = $routeParams.language || "nolang";
                    $scope.availableLanguages = [];

                    var registerLanguages = function (variants) {
                        var languages = _.without(Object.keys(variants), 'nolang');
                        $scope.availableLanguages = _.uniq($scope.availableLanguages.concat(languages)).map(function (tag) {
                            return tag.trim();
                        });

                        if ($scope.language === "nolang" && $scope.availableLanguages.length) {
                            $scope.language = $scope.availableLanguages[0];
                        }
                    };

                    $scope.onLanguageChange = function (language) {
                        $scope.language = language;
                        $location.search("language", language);
                    };

                    $scope.uri = function (scheme) {
                        return "#/hierarchy/" + $scope.visType + "/" + $scope.id + "/?uri=" + encodeURIComponent(scheme.uri);
                    };

                    $scope.embedUrl = function (visType, includeHost) {
                        return (includeHost ? "http://" + document.location.host : "") + "/visualize/embed/"
                            + visType + "/" + $scope.id + "?schemeUri=" + encodeURIComponent($routeParams.uri)
                            + "&language=" + $scope.language;
                    };

                    $scope.loadScheme = function (scheme) {
                        registerLanguages(scheme.label.variants);
                        $scope.loadSchemeByUri(scheme.uri);
                    };

                    $scope.loadSchemeByUri = function (schemeUri) {
                        if (!schemeUri) {
                            return;
                        }
                        $location.search("uri", schemeUri);

                        $scope.queryingDataset = true;
                        var schemePromise = visualization.skos.scheme(id, schemeUri);
                        schemePromise.then(function (scheme) {
                            $scope.queryingDataset = false;
                            $scope.selectedScheme = scheme;

                            scheme.label = scheme.name;

                            var queue = [scheme];
                            while (queue.length) {
                                var node = queue.shift();
                                if (node && node.name) {
                                    registerLanguages(node.name.variants);
                                    queue = queue.concat(node.children);
                                }
                            }
                        });
                    };

                    $scope.switch = function (type) {
                        $scope.visType = type;
                    };

                    $scope.visualizations = [
                        {
                            key: 'sunburst',
                            label: 'Sunburst'
                        },
                        {
                            key: 'treemap',
                            label: 'Treemap'
                        },
                        {
                            key: 'bilevel',
                            label: 'BiLevel'
                        },
                        {
                            key: 'packLayout',
                            label: 'Pack Layout'
                        },
                        {
                            key: 'force',
                            label: 'Force Layout'
                        },
                        {
                            key: 'cluster',
                            label: 'Rotating Cluster'
                        },
                        {
                            key: 'partition',
                            label: 'Partition Layout'
                        },
                        {
                            key: 'tree',
                            label: 'Tree'
                        },
                        {
                            key: 'radialTree',
                            label: 'Radial tree'
                        }
                    ];

                    if ($routeParams.uri) {
                        $scope.loadSchemeByUri($routeParams.uri);
                    }

                }]);
});