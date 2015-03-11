define(['angular', 'underscorejs'], function (ng, _) {
    'use strict';

    ng.module('component.controllers', []).
        controller('List',
        ['$scope', '$location', 'ComponentsService', '$routeParams', 'ngTableParams',
            function ($scope, $location, ComponentsService, $routeParams, ngTableParams) {

                var page = $routeParams.page || 1;
                var count = $routeParams.count || 10;

                $scope.tableParams = new ngTableParams({
                    page: page,            // show first page
                    count: count,           // count per page
                    sorting: {
                        name: 'asc'
                    }
                }, {
                    total: 0, // length of data
                    getData: function ($defer, params) {
                        ComponentsService.query({
                            skip: (params.page() - 1) * params.count(),
                            take: params.count()
                        }, function (data) {
                            params.total(data.count);
                            $defer.resolve(data.data);
                        });
                    }
                });

                $scope.time = function (a, b) {
                    return a || b;
                };

            }])
        .controller('Detail', [
            '$scope', '$routeParams', 'ComponentsService',
            function ($scope, $routeParams, components) {

                $scope.mirrorOpts = {
                    lineWrapping : true,
                    lineNumbers: true,
                    readOnly: 'nocursor',
                    mode: 'sparql'
                };


                components.get({id: $routeParams.id}, function(c){
                    $scope.component = c;
                });
                components.features({id: $routeParams.id}, function(f){
                    $scope.features = f;
                });
                components.inputs({id: $routeParams.id}, function(i){
                    $scope.inputs = i;
                });
                components.output({id: $routeParams.id}, function(o){
                    $scope.output = o;
                });
                components.descriptors({id: $routeParams.id}, function(d){
                    $scope.descriptors = d;
                });

                $scope.componentType = $routeParams.type;

            }])
        .controller('Add', [
            '$scope', '$location', 'FileUploader',
            function ($scope, $location, FileUploader) {
                var uploader = $scope.uploader = new FileUploader({
                    url: '/api/v1/components/add/ttl'
                });

                // CALLBACKS

                uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                    console.info('onWhenAddingFileFailed', item, filter, options);
                };
                uploader.onAfterAddingFile = function(fileItem) {
                    console.info('onAfterAddingFile', fileItem);
                };
                uploader.onAfterAddingAll = function(addedFileItems) {
                    console.info('onAfterAddingAll', addedFileItems);
                };
                uploader.onBeforeUploadItem = function(item) {
                    console.info('onBeforeUploadItem', item);
                };
                uploader.onProgressItem = function(fileItem, progress) {
                    console.info('onProgressItem', fileItem, progress);
                };
                uploader.onProgressAll = function(progress) {
                    console.info('onProgressAll', progress);
                };
                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    console.info('onSuccessItem', fileItem, response, status, headers);
                };
                uploader.onErrorItem = function(fileItem, response, status, headers) {
                    console.info('onErrorItem', fileItem, response, status, headers);
                };
                uploader.onCancelItem = function(fileItem, response, status, headers) {
                    console.info('onCancelItem', fileItem, response, status, headers);
                };
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                    console.info('onCompleteItem', fileItem, response, status, headers);
                };
                uploader.onCompleteAll = function() {
                    console.info('onCompleteAll');
                };

                console.info('uploader', uploader);
            }]);
});