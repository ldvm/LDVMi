define([
        'angular',
        './controllers/compatibilityCheckController',
        './controllers/validator/skosValidatorController',
        './controllers/validator/dataCubeValidatorController',
        './controllers/validator/validatorListController',
        './controllers/compatibilityController',
        './controllers/detailController',
        './controllers/discoveryController',
        './controllers/evaluationController',
        './controllers/indexController',
        './controllers/listController',
        './controllers/resultController',
        './controllers/hierarchyController',
        './controllers/layoutController',
        './directives/directives',
        './directives/uploader',
        './directives/pipeline',
        './websocket',
        './utils',
        './filters/labelFilter',
        './models/componentModel',
        './models/evaluationModel',
        './models/visualizationModel',
        './models/pipelineModel',
        'angular-resource',
        'angular-route',
        'angular-ui',
        'angular-loading-bar',
        'angular-file-upload',
        'ng-table',
        "bootstrap",
        "angular-moment",
        'highcharts-all',
        'highcharts-ng'
    ],
    function (ng) {
        'use strict';

        return ng.module('ldvm', [
            'ldvm.controllers',
            'ldvm.directives',
            'ldvm.filters',
            'ldvm.models',
            'ngRoute',
            'ngResource',
            'ngTable',
            'angular-loading-bar',
            'angularMoment',
            'highcharts-ng',
            'angularFileUpload'
        ]).directive("ngFileModel", [function () {
            return {
                scope: {
                    ngFileModel: "="
                },
                link: function (scope, element, attributes) {
                    element.bind("change", function (changeEvent) {
                        scope.ngFileModel = [];
                        for (var i in changeEvent.target.files) {
                            if (i !== "length" && i !== "item") {
                                var file = changeEvent.target.files[i];
                                var reader = new FileReader();
                                reader.onload = function (loadEvent) {
                                    scope.$apply(function () {
                                        scope.ngFileModel.push({
                                            lastModified: file.lastModified,
                                            lastModifiedDate: file.lastModifiedDate,
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                            data: loadEvent.target.result
                                        });
                                    });
                                };
                                reader.readAsDataURL(file);
                            }
                        }
                    });
                }
            };

        }]);
    });