define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Pipelines', [
            'PipelineApi',
            'PaginationUtils',
            function (pipelineApi,
                      paginationUtils) {
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
                    }
                };
            }
        ]);

});
