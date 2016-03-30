define(['angular', 'jquery', './directives'], function (ng, $) {
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
                link: function (scope, elm) {
                    elm = $(elm);
                    elm.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        })
                        .on('dragover dragenter', function () {
                            elm.addClass('is-dragover');
                        })
                        .on('dragleave dragend drop', function () {
                            elm.removeClass('is-dragover');
                        })
                        .on('drop', function (e) {
                            var source = {type: 'file', files: []};
                            var files = e.originalEvent.dataTransfer.files;
                            var total = files.length;
                            for (var i in files) {
                                if (i !== "length" && i !== "item") {
                                    var file = files[i];
                                    var reader = new FileReader();
                                    reader.onload = function (loadEvent) {
                                        source.files.push({
                                            lastModified: file.lastModified,
                                            lastModifiedDate: file.lastModifiedDate,
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                            data: loadEvent.target.result
                                        });
                                        --total;

                                        if(total < 1){
                                            scope.$apply(function(){
                                                scope.sources.push(source);
                                            });
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }
                        });
                },
                templateUrl: '/assets/javascripts/angular/ldvm/partials/createDatasource.html'
            };

        }])
});