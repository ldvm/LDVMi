define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Pipelines', [
            'PipelineApi',
            'PaginationUtils',
            '$connection',
            function (pipelineApi,
                      paginationUtils,
                      $connection) {
                return {
                    findPaginated: function (page, pageSize, filters) {
                        filters = filters || {};

                        var query = paginationUtils.buildQuery(page, pageSize);
                        ng.extend(query, filters);
                        return pipelineApi.query(query).$promise;
                    },
                    visualization: function (id) {
                        return pipelineApi.visualization({id: id}).$promise;
                    },
                    evaluations: function (id) {
                        return pipelineApi.evaluations({id: id}).$promise;
                    },
                    discover: function () {
                        return pipelineApi.discover().$promise;
                    },
                    makePermanent: function (id) {
                        return pipelineApi.makePermanent({id: id}).$promise;
                    },
                    get: function (id) {
                        return pipelineApi.get({id: id}).$promise;
                    },
                    getSingle: function (discoveryId) {
                        return pipelineApi.getSingle({discoveryId: discoveryId}).$promise;
                    },
                    evaluate: function (pipeline, onEvaluationIdAssigned, onDone) {
                        var uri = "ws://" + window.location.host + "/api/v1/pipelines/evaluate/" + pipeline.id;

                        var connection = $connection(uri);
                        connection.listen(
                            function () {
                                return true;
                            },
                            function (message) {

                                if (message.id) {
                                    onEvaluationIdAssigned(message.id);
                                }

                                if (message.message === '==== DONE ====') {
                                    onDone();
                                }
                            }
                        );
                    }
                };
            }
        ]);

});
