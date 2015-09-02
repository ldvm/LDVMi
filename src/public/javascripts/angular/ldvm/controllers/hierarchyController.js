define(['angular', './controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Hierarchy',
        [
            '$scope',
            '$routeParams',
            'Visualization',
            function (
                $scope,
                $routeParams,
                visualization
            ) {

                var id = $scope.id = $routeParams.id;
                if(!id){
                    return;
                }

                $scope.visType = $routeParams.type;

                $scope.schemes = [];
                $scope.scheme = null;
                $scope.queryingDataset = null;

                var promise = visualization.skos.schemes(id);
                $scope.queryingDataset = true;
                promise.then(function(schemes){
                    $scope.schemes = schemes;
                    $scope.queryingDataset = false;
                });

                $scope.uri = function(scheme){
                    return "#/hierarchy/" + $scope.visType + "/" + $scope.id + "/?uri=" + encodeURIComponent(scheme.uri);
                };

                $scope.embedUrl = function(visType){
                    return "/visualize/embed/" + visType + "/" + $scope.id + "?schemeUri=" + encodeURIComponent($routeParams.uri);
                };

                $scope.loadScheme = function(schemeUri){
                    $scope.queryingDataset = true;
                    var schemePromise = visualization.skos.scheme(id, schemeUri);
                    schemePromise.then(function(scheme){
                        $scope.queryingDataset = false;
                        $scope.scheme = scheme;
                    });
                };

                if($routeParams.uri){
                    $scope.loadScheme($routeParams.uri);
                }

            }]);
});