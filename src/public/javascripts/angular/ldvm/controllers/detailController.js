define(['angular', './controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Detail', [
            '$scope', '$routeParams', 'Pipelines',
            function ($scope, $routeParams, pipelines) {

                $scope.pipelineId = $routeParams.id;
                $scope.pipeline = null;
                $scope.data = [];

                pipelines.get($routeParams.id).then(function (pipeline) {
                    $scope.pipeline = pipeline;

                    if (parseInt($routeParams.autorun) === 1) {
                        window.location.href = "/pipelines#/evaluate/" + pipeline.id + "?autorun=1";
                    }
                });

                pipelines.visualization($routeParams.id).then(function (data) {
                    $scope.data = data;
                });

                pipelines.evaluations($routeParams.id).then(function (data) {
                    $scope.evaluations = data.data;
                });

                $scope.permanent = function (id) {
                    pipelines.makePermanent(id).then(function () {
                        $scope.pipeline.isTemporary = false;
                    });
                };

            }]);
});