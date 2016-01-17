define(['angular', './directives'], function (ng) {
    'use strict';

    return ng.module('ldvm.directives')
        .directive('uploader', [
            'FileUploader',
            'UuidUtils',
            function (FileUploader, uuidUtils) {
                return {
                    restrict: 'E',
                    scope: {
                        onUploadCompleted: '&'
                    },
                    controller: function ($scope) {
                        var uploader = $scope.uploader = new FileUploader({
                            url: '/api/v1/ttl/upload',
                            formData: [{uuid: uuidUtils.generate()}]
                        });

                        var lastId = null;

                        uploader.onCompleteItem = function (fileItem, response) {
                            lastId = response.id;
                        };

                        uploader.onCompleteAll = function(){
                            $scope.onUploadCompleted()(lastId);
                        }
                    },
                    templateUrl: '/assets/javascripts/angular/ldvm/partials/uploader.html'
                };
            }]
    );
});

