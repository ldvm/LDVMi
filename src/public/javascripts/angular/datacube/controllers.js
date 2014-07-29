define(['angular'], function (ng) {
    'use strict';

    ng.module('dataCube.controllers', []).
        controller('DataCube',
        ['$scope', 'DataCubeService', '$q', '$location', '$routeParams',
            function ($scope, DataCubeService, $q, $location, $routeParams) {

                var $id = $routeParams.id;

                if (!$id) {
                    return;
                }

                $scope.dataStructures = [];
                $scope.datasets = [];
                $scope.activeDSD = null;
                $scope.language = "cs";

                $scope.componentTypes = [
                    {name: "Dimension", key: "dimension", plural: "Dimensions"},
                    {name: "Measure", key: "measure", plural: "Measures"},
                    {name: "Attribute", key: "attribute", plural: "Attributes"},
                ];

                $scope.setLang = function (language) {
                    $scope.language = language;
                };

                $scope.availableLanguages = ["cs", "en"];

                DataCubeService.getDatasets({ visualizationId: $id }, function () {

                });

                DataCubeService.getDataStructures({ visualizationId: $id }, function (data) {
                    $scope.dataStructures = data;
                    if ($scope.dataStructures[0]) {
                        $scope.switchDSD($scope.dataStructures[0]);
                    }
                });

                $scope.switchDSD = function (dsd) {
                    $scope.dataStructures.forEach(function (ds) {
                        ds.isActive = false;
                    });
                    dsd.isActive = true;
                    $scope.activeDSD = dsd;
                    $scope.loadComponentsValues();
                };

                $scope.loadComponentsValues = function () {

                    var uris = [];
                    $scope.activeDSD.components.forEach(function (c) {

                        function pushUri(component) {
                            if (component && component.uri) {
                                uris.push(component.uri);
                            }
                        }

                        pushUri(c.dimension);
                        pushUri(c.attribute);
                        //pushUri(c.measure);
                    });

                    DataCubeService.getValues({ visualizationId: $id}, {uris: uris }, function (data) {
                        $scope.values = data;
                    });
                };

                $scope.refresh = function () {
                    DataCubeService.queryCube({visualizationId: $id}, {filters: collectFilters()}, function (response) {
                        $location.search({p: response.permalinkToken});
                        $scope.permalink = window.location.href;
                    });
                };

                function collectFilters() {
                    var filters = {
                        dsdUri: $scope.activeDSD.uri,
                        components: []
                    };

                    $scope.activeDSD.components.forEach(function (c) {
                        var componentProperty = c.dimension || c.measure || c.attribute;

                        if (componentProperty && componentProperty.uri) {
                            var filter = {
                                componentUri: componentProperty.uri,
                                type: c.dimension ? "dimension" : (c.measure ? "measure" : "attribute"),
                                values: ($scope.values[componentProperty.uri] || []).map(function(v){
                                    var r = {};
                                    if(v.uri){
                                        r.uri = v.uri;
                                    }else{
                                        r.label = v.label;
                                    }
                                    r.isActive = v.isActive;
                                    return r;
                                })
                            };
                            filters.components.push(filter);
                        } else {
                            throw "The component property has no URI. This is not supported";
                        }

                    });

                    return filters;
                }
            }])
    ;
});