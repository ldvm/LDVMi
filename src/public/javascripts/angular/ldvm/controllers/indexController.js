define(['angular', 'material', './controllers'], function (ng, material) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Index', ['$scope', 'Components', 'Pipelines', function ($scope, components, pipelines) {
            $scope.visualize = function () {

                var data = {
                    endpointUrl: $scope.endpointUrl,
                    graphUris: ($scope.graphUris || "").split("\n")
                };

                var promise = components.createDatasource(data);
                promise.then(function (id) {
                    var uri = "/discover/?dataSourceTemplateId=" + id.id;
                    if ($scope.showMore && $scope.combine) {
                        uri += "&combine=true";
                    }
                    window.location.href = uri;
                });
            };

            $scope.pipelines = [];
            var promise = pipelines.findPaginated(1, 10);
            promise.then(function (data) {
                $scope.pipelines = data.data;
            });

            material.initForms();
        }]);
});