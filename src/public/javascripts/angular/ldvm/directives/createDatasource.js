define(['angular', './directives'], function (ng) {
    'use strict';

    return ng.module('ldvm.directives')
        .directive("createDatasource", [function () {
            return {
                restrict: 'E',
                scope: {
                    sources: "=",
                    maxSourcesCount: '@'
                },
                controller: function ($scope) {

                    if ($scope.maxSourcesCount) {
                        $scope.maxSourcesCount = parseInt($scope.maxSourcesCount) || undefined;
                    }

                    $scope.add = function (type) {
                        if ($scope.maxSourcesCount === $scope.sources.length) {
                            return;
                        }
                        $scope.sources.push({type: type});
                    };

                    $scope.remove = function (source) {
                        var index = $scope.sources.indexOf(source);
                        $scope.sources.splice(index, 1);
                    };

                    $scope.canAdd = function () {
                        return !$scope.maxSourcesCount || $scope.maxSourcesCount > $scope.sources.length;
                    }

                },
                templateUrl: '/assets/javascripts/angular/ldvm/partials/createDatasource.html'
            };

        }])
});