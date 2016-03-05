define(['angular', './directives'], function (ng) {
    'use strict';

    return ng.module('ldvm.directives')
        .directive("ngFileModel", [function () {
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

        }])
});