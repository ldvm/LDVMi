define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Visualization', [
            'SkosApi',
            'DataCubeApi',
            'VisualizationApi',
            '$connection',
            function (skosApi,
                      dataCubeApi,
                      visualizationApi,
                      $connection) {
                return {
                    skos: {
                        schemes: function (id, tolerant) {
                            return skosApi.schemes({id: id, tolerant: !!tolerant}).$promise;
                        },
                        scheme: function (id, uri) {
                            return skosApi.scheme({id: id, schemeUri: uri}).$promise;
                        },
                        concepts: function (id, tolerant) {
                            return skosApi.concepts({id: id, tolerant: !!tolerant}).$promise;
                        },
                        create: function (dataSourceTemplateId) {
                            return skosApi.create({id: dataSourceTemplateId}).$promise;
                        }
                    },
                    dataCube: {
                        create: function (dataSourceTemplateId) {
                            return dataCubeApi.create({id: dataSourceTemplateId}).$promise;
                        },
                        dataStructures: function (id) {
                            return dataCubeApi.dataStructures({id: id}).$promise;
                        },
                        dataStructureComponents: function (id, uri, isTolerant) {
                            isTolerant = !!isTolerant;
                            return dataCubeApi.dataStructureComponents({
                                id: id,
                                uri: uri,
                                isTolerant: isTolerant
                            }).$promise;
                        }
                    },
                    dereference: function (uri) {
                        return visualizationApi.dereference({uri: uri}).$promise;
                    },
                    discovery: {
                        run: function (dataSourceIds,
                                       onPipelinesCountChanged,
                                       onProgress,
                                       onDone,
                                       errors) {
                            var isSsl = location.protocol === 'https:';
                            var wsProtocol = isSsl ? "wss" : "ws";
                            var uri = wsProtocol + "://" + window.location.host + "/api/v1/pipelines/discover";
                            var queryString = dataSourceIds.map(function (p) {
                                return "dataSourceTemplateIds=" + p;
                            });
                            errors = errors || []

                            uri += "?" + queryString.join("&");

                            var filterPredicate = function () {
                                return true;
                            };

                            var connection = $connection(uri);
                            connection.listen(filterPredicate, function (message) {

                                if ("pipelinesDiscoveredCount" in message) {
                                    onPipelinesCountChanged(message.pipelinesDiscoveredCount);
                                }

                                if ('message' in message && message.message.indexOf('ERROR') === 0) {
                                    errors.push(message.message);
                                }

                                if ("isFinished" in message) {
                                    onProgress(message);

                                    if (message.isFinished) {
                                        onDone(message.isSuccess);
                                    }
                                }

                            });

                        }
                    }
                };
            }]);

});
