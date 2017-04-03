define(['angular', './controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('CompatibilityCheck', [
            '$scope', '$routeParams', '$connection',
            function ($scope, $routeParams, $connection) {

                $scope.info = [];
                $scope.descriptorsCompatibility = [];

                var pipelineId = $routeParams.id;
                var l = window.location;
                var isSsl = l.protocol === 'https:';
                var wsProtocol = isSsl ? "wss" : "ws";
                var url = wsProtocol + "://" + l.host + "/api/v1/compatibility/check/" + pipelineId;

                var connection = $connection(url);
                connection.listen(function () {
                    return true;
                }, function (data) {
                    $scope.$apply(function () {
                        if ("isCompatible" in data) {
                            $scope.descriptorsCompatibility.push(data);
                        } else {
                            $scope.info.unshift(data);
                        }

                        $scope.info.splice(100);
                    });
                });


            }]);
});
