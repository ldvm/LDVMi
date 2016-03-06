define(['angular', './directives'], function (ng) {
    'use strict';

    return ng.module('ldvm.directives')
        .directive("languageSwitch", [function () {
            return {
                restrict: 'E',
                scope: {
                    language: '=',
                    availableLanguages: '=',
                    languageChanged: '&'
                },
                controller: function ($scope) {
                    $scope.setLang = function (language) {
                        $scope.language = language;
                        if ($scope.languageChanged) {
                            $scope.languageChanged({language: language});
                        }
                    };
                },
                templateUrl: '/assets/javascripts/angular/ldvm/partials/languageSwitch.html'
            };

        }])
});