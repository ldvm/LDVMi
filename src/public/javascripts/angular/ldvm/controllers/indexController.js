define(['angular', 'material', 'underscore.string', './controllers'], function (ng, material, _s) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Index', ['$scope', 'Components', 'Pipelines', function ($scope, components, pipelines) {

            $scope.showMore = false;
            $scope.endpoints = [{}];
            $scope.pipelines = [];

            $scope.visualize = function (feelsLucky) {

                var data = $scope.endpoints.splice(0, $scope.endpoints.length - 1).map(function (e) {
                    return {
                        url: e.url,
                        graphUris: e.graphUris ? e.graphUris.split(/\s+/) : undefined
                    };
                });

                components.createDatasource(data).then(function (results) {
                    var uri = "/discover/?";
                    var params = results.map(function (r) {
                        return "dataSourceTemplateIds=" + r.id;
                    });
                    uri += params.join('&');
                    if ($scope.showMore && $scope.combine) {
                        uri += "&combine=true";
                    }
                    if (feelsLucky) {
                        uri += "&lucky=1";
                    }
                    window.location.href = uri;
                });
            };


            var promise = pipelines.findPaginated(1, 10);
            promise.then(function (data) {
                $scope.pipelines = data.data;
            });

            $scope.$watch('endpoints', function (newVal) {
                var lastIndex = newVal.length - 1;
                if (!(!newVal[lastIndex].url || newVal[lastIndex].url == "")) {
                    $scope.endpoints.push({});
                    material.initForms();
                }
            }, true);
        }]);
});