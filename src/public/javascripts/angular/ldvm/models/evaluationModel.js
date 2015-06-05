define(['angular', './models'], function (ng) {
    'use strict';

    ng.module('ldvm.models')
        .service('Evaluation', ['EvaluationApi', function (evaluationApi) {
            return {
                result: function (id) {
                    return evaluationApi.result({id: id}).$promise;
                }
            };
        }]);

});
