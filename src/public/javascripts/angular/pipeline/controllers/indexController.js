define(['angular', 'material', './controllers'], function (ng, material) {
    'use strict';

    return ng.module('pipeline.controllers')
        .controller('Index', ['$scope', 'Components', function ($scope, components) {
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

            material.initForms();
        }]);
});