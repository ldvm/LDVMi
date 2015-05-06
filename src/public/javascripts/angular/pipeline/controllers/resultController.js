define(['angular', './controllers'], function (ng) {
    'use strict';

    return ng.module('pipeline.controllers')
        .controller('Result', [
            '$scope', '$routeParams', 'Evaluation',
            function ($scope, $routeParams, evaluation) {
            evaluation.result($routeParams.id).then(function (data) {
                $scope.results = data;
            });
        }]);
});