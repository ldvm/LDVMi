define(['angular', '../controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('SkosValidator', [
            '$scope',
            '$routeParams',
            '$location',
            'Visualization',
            'FileUploader',
            function ($scope,
                      $routeParams,
                      $location,
                      visualization,
                      FileUploader) {

                $scope.id = $routeParams.id;

                var UUID = (function () {
                    var self = {};
                    var lut = [];
                    for (var i = 0; i < 256; i++) {
                        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
                    }
                    self.generate = function () {
                        var d0 = Math.random() * 0xffffffff | 0;
                        var d1 = Math.random() * 0xffffffff | 0;
                        var d2 = Math.random() * 0xffffffff | 0;
                        var d3 = Math.random() * 0xffffffff | 0;
                        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
                    };
                    return self;
                })();

                var uploader = $scope.uploader = new FileUploader({
                    url: '/api/v1/ttl/upload',
                    formData: [{uuid: UUID.generate()}]
                });

                var lastId;

                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    lastId = response.id;
                };

                uploader.onCompleteAll = function () {
                    if (lastId) {
                        visualization.createSkos(lastId).then(function (visualisationId) {
                            $location.path('/validator/skos/' + visualisationId.id);
                        });
                    }
                };

                function entityExists(collection, uri) {
                    if (!uri) {
                        return false;
                    }
                    var result = false;
                    ng.forEach($scope.schemes, function (s) {
                        if (s.uri === uri) {
                            result = true;
                        }
                    });
                    return result;
                }

                if ($scope.id) {
                    var promise = visualization.skosSchemes($scope.id, true);
                    $scope.queryingDataset = true;
                    promise.then(function (schemes) {
                        $scope.schemes = schemes;
                        $scope.queryingDataset = false;
                    });

                    $scope.schemeExists = function (uri) {
                        return entityExists($scope.schemes, uri);
                    };

                    $scope.linkExists = function (uri) {
                        return entityExists($scope.concepts, uri);
                    };

                    $scope.uri = function(uri){
                        return encodeURIComponent(uri)
                    };

                    var conceptsPromise = visualization.skosConcepts($scope.id, true);
                    $scope.queryingDataset = true;
                    conceptsPromise.then(function (concepts) {
                        $scope.concepts = concepts;
                        $scope.queryingDataset = false;
                    });
                }

            }]);
});