define(['angular', './controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Detail', [
            '$scope', '$routeParams', 'Pipelines',
            function ($scope, $routeParams, pipelines) {

                $scope.pipelineId = $routeParams.id;

                $scope.data = [];

                pipelines.visualization($routeParams.id).then(function (data) {
                    $scope.data = data;
                    console.log(data);
                });

                pipelines.evaluations($routeParams.id).then(function (data) {
                    $scope.evaluations = data.data;
                });

            }]);
});